import http, {IncomingMessage, ServerResponse} from "http";
import https from "https";
import { Response } from "../handler/response";
import { Request } from "../handler/request";
import { error } from "console";
import { Router } from "../handler/router";

//to check the url pattern
const pattern = /^\/[a-z0-9\-\/]*$/;

/**
 * to passing data from one middleware to other
 */
interface RequestWithContext extends IncomingMessage {
  context?: Record<string, any>;
}
/**
 * this to handle middlewares and handlers
 * if using next it will chain to the next middlewares
 * if wasnt it was the end of the handler
 * define the Middleware and Handler Type
 * @private
*/  
export type Middleware = (req: Request, res: Response, next: () => void) => void;
export type Handler = (req: Request, res: Response) => void | Promise<void>;

//main class
class _func {
    //to saved all the routes
    private routes: {
        method: string;
        endpoint: string;
        middlewares: Middleware[];
        handler: Handler;
    }[] = [];

    private globalMiddlewares: Middleware[] = [];
     //start the apps
    async start(port: number, text: string | '') {
        const server = http.createServer(async (req, res) => {
            const method = req.method?.toUpperCase() || '';
            const url = req.url || '';
            //wrap the old res using my own response to make it simpler
            const customRes = new Response(res);
            const customReq = new Request(req);
            await customReq.parseBody(); 

            const route = this.routes.find(r => r.method === method && r.endpoint === url);
            
            if(!route){
                return customRes.status(404).json({ error: "routes not found", url: url, method: method});
            }
            const combinedMiddlewares = [...this.globalMiddlewares, ...route.middlewares];
            const handler = route.handler;

            let index = -1;
            const next = () => {
                index++;
                if (index < combinedMiddlewares.length) {
                    combinedMiddlewares[index](customReq, customRes, next);
                } else {
                    handler(customReq, customRes);
                }
            };


            next();
        });

        server.listen(port, () => {
            console.log(text? text : `server is running at http://localhost:${port}`);
        });
    }

    /**
     * use function
     * @param middleware callback with next to continue to next function
     *
     */
    /**
     * Register global middleware for every request.
     */
    use(pathOrMiddleware: string | Middleware, maybeRouter?: Router) {
        if (typeof pathOrMiddleware === "string" && maybeRouter instanceof Router) {
            const routes = maybeRouter.getRoutes();
            for (const route of routes) {
                this["register"](route.method, route.endpoint, [...route.middlewares, route.handler]);
            }
        } else if (typeof pathOrMiddleware === "function") {
            if (!this.globalMiddlewares.includes(pathOrMiddleware)) {
                this.globalMiddlewares.push(pathOrMiddleware);
            }
        }
    }

    private register(method: string, endpoint: string, handlers: [...Middleware[], Handler]) {
        if (!pattern.test(endpoint)) {
            throw new SyntaxError("Invalid Endpoint");
        }

        const middlewares = handlers.slice(0, -1) as Middleware[];
        const handler = handlers[handlers.length - 1] as Handler;

        this.routes.push({ method, endpoint, middlewares, handler });
    }

    /**
     * using next chaining function
     * @method POST
     * @param endpoint url endpoint 
     * @param handlers POST middleware and callback
     */
    async post(endpoint: string, ...handlers: [...Middleware[], Handler]){
        this.register("POST", endpoint, handlers);
    }
    /**
     * using next chaining function
     * @method GET
     * @param endpoint url endpoint 
     * @param handlers GET middleware and callback
     */
    async get(endpoint: string, ...handlers: [...Middleware[], Handler]){
        this.register("GET", endpoint, handlers);
    }
    /**
     * using next chaining function
     * @method PUT
     * @param endpoint url endpoint 
     * @param handlers PUT middleware and callback
     */
    async put(endpoint: string, ...handlers: [...Middleware[], Handler]){
        this.register("PUT", endpoint, handlers);
    }
    /**
     * using next chaining function
     * @method DELETE
     * @param endpoint url endpoint 
     * @param handlers middleware and callback
     */
    async delete(endpoint: string, ...handlers: [...Middleware[], Handler]){
        this.register("DELETE", endpoint, handlers);
    }
}

export const capi = new _func();