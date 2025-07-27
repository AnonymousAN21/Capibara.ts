import { ServerResponse } from "http";

export class Response {
    private res: ServerResponse;
    private code?: number;

    /**speed test variable
     * for my .test function
     * to check the speed and send the response
     */
    private timestart?: bigint;
    data?: string;

    constructor(res: ServerResponse) {
        this.res = res;
    }

    end(data?: string) {
        this.res.end(data);
    }

    setHeader(key: string, value: string) {
        this.res.setHeader(key, value);
    }
    /**
     * to return value as json
     * @param code to set the status code 
     * @returns 
     */
    status(code: number) {
        if (code < 100 || code > 999)
            throw new RangeError(`Invalid status code`);
        this.code = code;
        this.res.statusCode = code;
        return this;
    }

    /**
     * to return value as json
     * @param data return response json or array
     * @returns 
     */
    json(data = {}) {
        if (!this.code)
            throw new SyntaxError(`Please put status code first`);


        /**
         * to check if the data was array it will automatically
         * formatted the data to be object
         */
        if(Array.isArray(data)){
            const formatted = {
                data
            }
            return this.res.end(JSON.stringify(formatted, null, 2))
        }
        this.res.end(JSON.stringify(data, null, 2));
    }

        /**
     * to return value as text
     * @param str return response raw text
     * @returns 
     */
    text(str: string) {
        if (!this.code)
            throw new SyntaxError(`Please put status code first`);
        this.res.end(str);
    }

    testStart() {
        this.timestart = process.hrtime.bigint(); // time in nanoseconds
    }

    testEnd(str: string | object) {
        const timeend = process.hrtime.bigint(); // also in nanoseconds

        if (!this.timestart) {
            throw new SyntaxError("testStart() must be called before testEnd()");
        }

        const durationNs = timeend - this.timestart; // nanoseconds
        const durationMs = Number(durationNs) / 1_000_000; // convert to milliseconds

        let _dta: string;
        if (typeof str === "object") {
            _dta = JSON.stringify(str);
        } else {
            _dta = str;
        }

        const data = {
            duration_ms: +durationMs.toFixed(3), // e.g., 0.111
            data: _dta
        };

        this.res.setHeader("Content-Type", "application/json");
        this.res.end(JSON.stringify(data, null, 2));
    }
}

