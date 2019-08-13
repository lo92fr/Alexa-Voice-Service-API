// https://developer.amazon.com/docs/alexa-voice-service/speechsynthesizer.html
import { AVSApi } from "./avs-api";
import * as play from 'audio-play';
import * as decode from 'audio-decode';
import * as av from 'av';
import { RecognizerState } from "./enum/recognizerState";

require('mp3')


export default class SpeechSynthesizer {

    constructor(private readonly avsApi: AVSApi) {
    }

    async Play(data) {
        decode(data.toString(), (err, audioBuffer) => {

            let playback = play(audioBuffer, [], () => {
                this.avsApi.SpeechRecognizer.SetState(RecognizerState.Recognizing);
            });
            playback.play();
        });



    }

    public DispatchDirective(json, parts): void {
        if (json.directive.header.name == 'Speak') {
            console.log("Have to speak !!");

            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];

                if (part.type == 'application/octet-stream') {
                    console.log("application/octet-stream");
                    var fs = require('fs');

                    fs.writeFileSync('myBinaryFile', part.data.toString(), 'binary', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('written to disk');
                    });

                    this.Play(part.data);


                }
            }

        }
    }

}
