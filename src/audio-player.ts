// https://developer.amazon.com/docs/alexa-voice-service/audioplayer.html
enum AudioPlayerState {
    IDLE,
    PLAYING,
    STOPPED,
    PAUSED,
    BUFFER_UNDERRUN,
    FINISHED,
}

import { API_VERSION, HTTP2_BOUNDARY } from "./constants/general";
import Http2Utility from "./http2-utility";

// @ts-ignore
import * as gstreamer from 'gstreamer-superficial';

import * as request from 'request';
import { AVSApi } from "./avs-api";



export default class AudioPlayer {
    private state: AudioPlayerState;
    private playToken: string;
    private readonly http2Utility: Http2Utility;
    private pipeline;

    constructor(private readonly avsApi: AVSApi) {
        this.state = AudioPlayerState.IDLE;
        this.http2Utility = new Http2Utility();
    }

    public async playUri(uri: string) {

        async function loadUri() {
            return new Promise(resolve => {
                request.get(uri, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        uri = body;
                        console.log('body:' + body);
                        resolve();
                    }
                });
            })
        }

        if (uri.indexOf(".ashx") >= 0)
            await loadUri();

        console.log('uri:' + uri);

        this.pipeline = new gstreamer.Pipeline('playbin uri=' + uri);
        this.pipeline.play();
    }

    public DispatchDirective(json, parts): void {

        if (json.directive.header.name == 'Play') {
            console.log("Have to play !!");
            //console.log("%o", json)
            this.playToken = json.directive.payload.audioItem.stream.token;
            console.log("uri is : " + json.directive.payload.audioItem.stream.url);

            this.playUri(json.directive.payload.audioItem.stream.url);
            this.UpdateAvsState();
        }
        else if (json.directive.header.name == 'Stop') {
            console.log("Have to stop !!");
            this.pipeline.stop();
        }
    }

    public UpdateAvsState(): void {
        var options = {
            ':method': 'POST',
            ':path': `/${API_VERSION}/events`,
            'authorization': 'Bearer ${accessToken}',
            "content-type": `multipart/form-data; boundary=${HTTP2_BOUNDARY}`,
        }

        var req = this.avsApi.Http2Client.request(options);

        const metadata = this.http2Utility.createMultipartMetadata<AVS.AudioPlayer.PlaybackStartedMetadata>({
            context: this.avsApi.context,
            event: {
                header: {
                    namespace: "AudioPlayer",
                    name: "PlaybackStarted",
                    messageId: "message-123"
                },
                payload: {
                    token: this.playToken,
                    offsetInMilliseconds: 0
                }
            }
        });

        req.on("data", (data) => {
            console.log("rec data:" + data);
        });

        req.on("error", (error) => {
            console.log("rec data:" + error);
        });

        req.on("end", () => {
            console.log("rec dataend ");
        });

        req.on("response", (headers, flags) => {
            console.log("rec response");
        });

        req.setEncoding("utf8");
        req.write(metadata);
        req.end();

    }

}
