// https://developer.amazon.com/docs/alexa-voice-service/speaker.html
import { AVSApi } from "./avs-api";

export default class Speaker {
    constructor(private readonly avsApi: AVSApi) {
    }

    public DispatchDirective(json, parts): void {

        if (json.directive.header.name == 'SetVolume') {
            console.log("Have to set volume: " + json.directive.payload.volume);
        }
    }
}
