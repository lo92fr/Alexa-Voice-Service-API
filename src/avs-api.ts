import { ReadStream, WriteStream } from "fs";
import * as http2 from "http2";

import { IAVSOptions, TokenService } from "./auth/token-service";
import { BASE_URLS } from "./constants/base-urls";
import { API_VERSION } from "./constants/general";
import Directives from "./directives";
import Speaker from "./speaker";
import AudioPlayer from "./audio-player";
import Speaker from "./Speaker";
import SpeechRecognizer from "./speech-recognizer";
import SpeechSynthetizer from "./speech-synthesizer";
import System from "./system";
import * as multipart from 'parse-multipart';
import { RecognizerState } from "./enum/recognizerState";

export class AVSApi {
    public accessToken: string;
    private readonly player: AudioPlayer;
    private readonly speechRecognizer: SpeechRecognizer;
    private readonly speechSynthetizer: SpeechSynthetizer;
    private readonly directives: Directives;
    private readonly system: System;
    private readonly speaker: Speaker;
    private readonly client;
    public readonly context: AVS.Context;

    constructor(private readonly readStream: ReadStream, private readonly writeStream: WriteStream, options: IAVSOptions) {
        this.client = http2
            .connect(`${BASE_URLS.europe}`)
            .on("error", (err) => console.error(err))
            .on("socketError", (err) => console.error(err));

        this.context = [];
        this.speechRecognizer = new SpeechRecognizer(this, this.readStream);
        this.speechSynthetizer = new SpeechSynthetizer(this);
        this.player = new AudioPlayer(this);
        this.directives = new Directives(this);
        this.system = new System(this);
        this.speaker = new Speaker(this);

        const tokenService = new TokenService(options);
        tokenService.Token$.subscribe((res) => (this.accessToken = res.access_token));
    }

    get Http2Client() { return this.client };
    get SpeechRecognizer() { return this.speechRecognizer; }
    get SpeechSynthetizer() { return this.speechSynthetizer; }
    get AudioPlayer() { return this.player; }
    get Directives() { return this.directives; }
    get System() { return this.system; }

    public DispatchResponse(data: string) {
        data = "--------abcde123\r\n" + data;

        var buffer = new Buffer(data.toString(), "utf8");
        var parts = multipart.Parse(buffer, "------abcde123");


        console.log('nbpart:' + parts.length);

        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            /*
            console.log(""); 
            console.log("part " + i + " : ");
            console.log("================================");
            console.log("part is : %o", part);
            */

            if (part.type == 'application/json') {
                var json = JSON.parse(part.data);

                //console.log("a1:" + part.data);
                console.log("a2: %o", json);

                this.DispatchDirective(json, parts);
            }
            //console.log("=============================");
        }
    }


    public DispatchDirective(json, parts): void {
        if (json.directive) {
            if (json.directive.header.namespace == 'AudioPlayer')
                this.player.DispatchDirective(json, parts);
            else if (json.directive.header.namespace == 'SpeechSynthesizer')
                this.speechSynthetizer.DispatchDirective(json, parts);
            else if (json.directive.header.namespace == 'SpeechRecognizer')
                this.speechRecognizer.DispatchDirective(json, parts);
            else if (json.directive.header.namespace == 'Speaker')
                this.speaker.DispatchDirective(json, parts);
        }
    }

    public start(): void {
        if (!this.accessToken) {
            setTimeout(() => {
                console.log("Access token not present. Re-trying in 1000");
                this.start();
            }, 1000);
            return;
        }

        console.log(`Access token found`);

        this.init();
    }


    private async init(): Promise<void> {
        await this.directives.connect();
        await this.system.synchronizeState();
        await this.speechRecognizer.SetState(RecognizerState.Recognizing);
    }
}
