// https://developer.amazon.com/docs/alexa-voice-service/system.html
import * as http2 from "http2";

import { API_VERSION, HTTP2_BOUNDARY } from "./constants/general";
import Http2Utility from "./http2-utility";
import { AVSApi } from './avs-api';

export default class System {
    private readonly http2Utility: Http2Utility;

    constructor(private readonly avsApi: AVSApi) {
        this.http2Utility = new Http2Utility();
    }

    public synchronizeState(): Promise<void> {
        const req = this.avsApi.Http2Client.request({
            ":method": "POST",
            ":path": `/${API_VERSION}/events`,
            authorization: `Bearer ${this.avsApi.accessToken}`,
            "content-type": `multipart/form-data; boundary=${HTTP2_BOUNDARY}`,
        });


        const metadata = this.http2Utility.createMetadata<AVS.System.SynchronizeStateMetadata>({
            context: this.avsApi.context,
            event: {
                header: {
                    namespace: "System",
                    name: "SynchronizeState",
                    messageId: "test",
                },
                payload: {},
            },
        });

        return new Promise<void>((resolve) => {
            console.log("System sync");

            req.on("response", (headers, flags) => {
                console.log("===================================");
                console.log("synchronise response start");
                // tslint:disable-next-line:forin
                for (const name in headers) {
                    console.log(`${name}: ${headers[name]}`);
                }
                console.log("synchronise response end");
                console.log("===================================");
                resolve();
            });

            req.write(metadata);

            req.setEncoding("utf8");
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                console.log("===================================");
                console.log("synchronise data start");
                console.log(`\n${data}`);
                console.log("synchronise data end");
                console.log("===================================");


            });
            req.end();
        });
    }
}
