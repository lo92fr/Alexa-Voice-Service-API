import { HTTP2_BOUNDARY } from "./constants/general";

export default class Http2Utility {
    public createMetadata<T>(body: T): string {
        const output =
            `--${HTTP2_BOUNDARY}\r\n`
            + `Content-Disposition: form-data; name="metadata"\r\n`
            + `Content-Type: application/json; charset=UTF-8\r\n`
            + `\r\n`
            + `${JSON.stringify(body)}\r\n`
            + `\r\n`
            + `--${HTTP2_BOUNDARY}--\r\n`;

        return output;
    }

    public createMultipartMetadata<T>(body: T): string {
        const output =
            `--${HTTP2_BOUNDARY}\r\n`
            + `Content-Disposition: form-data; name="metadata"\r\n`
            + `Content-Type: application/json; charset=UTF-8\r\n`
            + `\r\n`
            + `${JSON.stringify(body)}\r\n`
            + `\r\n`;

        return output;
    }

    public createBinaryAudioAttachment(buffer: Buffer): string {
        const output =
            `--${HTTP2_BOUNDARY}\r\n`
            + `Content-Disposition: form-data; name="audio"\r\n`
            + `Content-Type: application/octet-stream\r\n`
            + `\r\n`;
        return output;
    }

    public createEnding(): string {
        const output =
            `--${HTTP2_BOUNDARY}--\r\n`
            + `\r\n`;


        return output;
    }
}
