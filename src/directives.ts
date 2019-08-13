// https://developer.amazon.com/docs/alexa-voice-service/manage-http2-connection.html
import * as http2 from "http2";
import { Observable } from "rxjs/Observable";

import { API_VERSION } from "./constants/general";
import * as multipart from 'parse-multipart';
import { AVSApi } from './avs-api';


export default class Directives {
    private directive$: Observable<AVS.Directive>;

    constructor(private readonly avsApi: AVSApi) { }

    public connect(): Promise<void> {
        const req = this.avsApi.Http2Client.request({
            ":path": `/${API_VERSION}/directives`,
            authorization: `Bearer ${this.avsApi.accessToken}`,
        });

        return new Promise<void>((resolve) => {
            req.on("response", (headers, flags) => {
                console.log("==================================");
                console.log("= response from directives start");

                // tslint:disable-next-line:forin
                for (const name in headers) {
                    console.log(`${name}: ${headers[name]}`);
                }

                console.log(flags);

                console.log("= response from directives end");
                console.log("==================================");

                resolve();
            });

            req.setEncoding("utf8");
            req.on("data", (data) => {

                this.avsApi.DispatchResponse(data);
                //console.log("==================================");
                //console.log("directive data1 start");



                //console.log("directive data1 end");
                //console.log("==================================");
            });
            req.on("end", () => {
                console.log("==================================");
                console.log("directive end start");
                console.log("directive end end");
                console.log("==================================");

            });

            //req.end();
        });
    }

    public get Directive$(): Observable<AVS.Directive> {
        return this.directive$;
    }
}
