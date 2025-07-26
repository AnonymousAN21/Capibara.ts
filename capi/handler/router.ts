import http, {IncomingMessage, ServerResponse} from "http";
import https from "https";
import { Response } from "../handler/response";
import { Request } from "../handler/request";
import { error } from "console";
import { capi } from "../main/capi";
import { Middleware, Handler } from "../main/capi";
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

export class Router {
    private prefix: string;
    private routes: {
        method: string;
        endpoint: string;
        middlewares: Middleware[];
        handler: Handler;
    }[] = [];

    constructor(prefix: string = "") {
        this.prefix = prefix;
    }

    private register(method: string, endpoint: string, handlers: [...Middleware[], Handler]) {
        const middlewares = handlers.slice(0, -1) as Middleware[];
        const handler = handlers[handlers.length - 1] as Handler;

        this.routes.push({
            method,
            endpoint: this.prefix + endpoint,
            middlewares,
            handler
        });
    }

    getRoutes() {
        return this.routes;
    }

    get(endpoint: string, ...handlers: [...Middleware[], Handler]) {
        this.register("GET", endpoint, handlers);
    }

    post(endpoint: string, ...handlers: [...Middleware[], Handler]) {
        this.register("POST", endpoint, handlers);
    }

    put(endpoint: string, ...handlers: [...Middleware[], Handler]) {
        this.register("PUT", endpoint, handlers);
    }

    delete(endpoint: string, ...handlers: [...Middleware[], Handler]) {
        this.register("DELETE", endpoint, handlers);
    }
}
