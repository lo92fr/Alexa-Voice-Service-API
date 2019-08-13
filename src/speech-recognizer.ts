// https://developer.amazon.com/docs/alexa-voice-service/speechrecognizer.html
import { ReadStream } from "fs";
import * as http2 from "http2";
import { AVSApi } from "./avs-api";
import { v4 as uuid } from "uuid";

import { API_VERSION, HTTP2_BOUNDARY } from "./constants/general";
import Http2Utility from "./http2-utility";
import { RecognizerState } from "./enum/recognizerState";

export default class SpeechRecognizer {
    private readonly http2Utility: Http2Utility;
    private needDecode: boolean = true;
    private req;
    private resolveCb;
    private state: RecognizerState;

    constructor(private readonly avsApi: AVSApi, private readonly readStream: ReadStream) {
        this.http2Utility = new Http2Utility();
        this.state = RecognizerState.Idle;
    }

    public StopCapture() {
        this.endRecord();
    }

    protected endRecord() {
        console.log("=============================");
        console.log("endRecord start");

        if (this.req.closed) {
            return;
        }

        console.log("ending speech");

        this.state = RecognizerState.Busy;

        this.readStream.pause();
        this.needDecode = false;
        var ending = this.http2Utility.createEnding();
        this.req.write(ending);
        this.req.end();
        console.log("endRecord end");
        console.log("=============================");
        this.resolveCb();
    }


    public DispatchDirective(json, parts): void {

        if (json.directive.header.name == 'StopCapture') {
            console.log("Have to stop !!");
            console.log("Stop recognizer !!");
            this.StopCapture();
        }
    }

    public SetState(state): void {
        if (this.state == state)
            return;

        this.state = state;

        if (this.state == RecognizerState.Recognizing) {
            this.recognize();
        }
    }

    public recognize(): Promise<void> {
        var options = {
            ':method': 'POST',
            ':scheme': 'https',
            ':path': `/${API_VERSION}/events`,
            'authorization': 'Bearer ${accessToken}',
            "content-type": `multipart/form-data; boundary=${HTTP2_BOUNDARY}`,
        }

        this.req = this.avsApi.Http2Client.request(options);
        this.needDecode = true;

        const metadata = this.http2Utility.createMultipartMetadata<AVS.SpeechRecognizer.SpeechRecognizerMetadata>({
            context: this.avsApi.context,
            event: {
                header: {
                    namespace: "SpeechRecognizer",
                    name: "Recognize",
                    messageId: "messageId-" + uuid(),
                    dialogRequestId: "dialogRequestId-" + uuid()
                },
                payload: {
                    profile: "NEAR_FIELD",
                    format: "AUDIO_L16_RATE_16000_CHANNELS_1",
                    initiator: {
                        type: "TAP",
                    },
                },
            },
        });


        return new Promise<void>((resolve) => {
            let data = "";

            this.resolveCb = resolve;


            console.log("speech recognizer");
            this.req.setEncoding("binary");
            this.req.write(metadata);

            console.log(metadata);

            this.readStream.resume();

            this.readStream.on("data", (chunk: Buffer) => {
                console.log("data in");
                //console.log(chunk.length);
                if (this.needDecode) {
                    const audio = this.http2Utility.createBinaryAudioAttachment(chunk);
                    this.req.write(audio);
                    this.req.write(chunk);
                    /*
                    console.log(audio);
                    console.log(chunk);
                    */
                }
            });

            this.readStream.on("end", () => {
                //this.endRecord();
            });

            setTimeout(() => {
                //this.endRecord();
            }, 7000);

            this.req.on("data", (chunk) => {
                //console.log(`chunk:${chunk}`);
                data += chunk;
            });
            this.req.on("error", (error) => {
                console.error(`Downchannel error ${error}`);
            });
            this.req.on("socketError", (error) => {
                console.error(`Downchannel socketError error ${error}`);
            });
            this.req.on("goAway", (error) => {
                console.error(`Downchannel goaway ${error}`);
            });
            this.req.on("response", (headers, flags) => {
                //console.log("=============================");
                //console.log("response from speech start");
                // tslint:disable-next-line:forin
                //for (const name in headers) {
                //    console.log(`header:${name}: ${headers[name]}`);
                //}
                //console.log("response from speech end");
                //console.log("=============================");
            });

            this.req.on("end", () => {
                this.avsApi.DispatchResponse(data);
            });


        });

    }
}
