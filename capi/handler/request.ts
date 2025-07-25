import { IncomingMessage } from "http";
import { parse as parseUrl } from "url";
import { parse as parseQuery } from "querystring";

export class RequestWrapper {
    private req: IncomingMessage;

    public params: Record<string, string> = {};
    public query: Record<string, string | string[] | undefined> = {};
    public headers: Record<string, string | string[] | undefined> = {};
    public method: string;
    public url: string;
    public body: any; // <- parsed body goes here

    constructor(req: IncomingMessage) {
        this.req = req;
        this.method = req.method || "GET";
        this.url = req.url || "/";
        this.headers = req.headers;

        // parse query string
        const parsed = parseUrl(this.url);
        if (parsed.query) {
            this.query = parseQuery(parsed.query);
        }
    }

    /** Parses the request body once, stores it in `this.body` */
    async parseBody(): Promise<void> {
        const chunks: Uint8Array[] = [];

        for await (const chunk of this.req) {
            chunks.push(chunk);
        }

        const raw = Buffer.concat(chunks).toString();

        const contentType = this.getHeader("content-type");

        if (contentType?.includes("application/json")) {
            try {
                this.body = JSON.parse(raw);
            } catch {
                throw new SyntaxError("Invalid JSON body");
            }
        } else if (contentType?.includes("application/x-www-form-urlencoded")) {
            this.body = parseQuery(raw); // convert to object
        } else {
            this.body = raw; // plain text or unknown type
        }
    }

    getHeader(key: string): string | undefined {
        const val = this.headers[key.toLowerCase()];
        return Array.isArray(val) ? val[0] : val;
    }
}
