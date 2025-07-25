import http, {IncomingMessage, ServerResponse} from "http";
import https from "https";
import { ResponseWrapper } from "../handler/response";
import { RequestWrapper } from "../handler/request";
import { error } from "console";
//to check the url pattern
const pattern = /^\/[a-z0-9\-\/]*$/;
/**
 * this to handle middlewares and handlers
 * if using next it will chain to the next middlewares
 * if wasnt it was the end of the handler
 * define the Middleware and Handler Type
 * @private
*/  

/**
 * @ignore
 * still on progress
 */
type Middleware = (req: RequestWrapper, res: ResponseWrapper, next: () => void) => void;
type Handler = (req: RequestWrapper, res: ResponseWrapper) => void

class router{
    private group: {
        routename: string,
        router: {
            method: string;
            endpoint: string;
            middlewares: Middleware[];
            handler: Handler;
        }[]
    }[] = []
    use(...middleware: [...Middleware[]]){
        this.group
    }
}