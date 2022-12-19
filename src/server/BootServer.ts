import {parse} from 'url'
import next from 'next'
import {NextServer, NextServerOptions} from "next/dist/server/next";
import * as http from "http";


export class BootServer {
    protected isDev: boolean;
    private useDefaultHeaders: boolean;
    private nextApp: NextServer;
    private nextConfig: NextServerOptions;
    private httpServer: http.Server;
    private readonly onCreateServerHook: Function;

    constructor({useDefaultHeaders= true as boolean , nextConfig = {} as NextServerOptions, onCreateServer = {} as Function}) {
        this.isDev = process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.setNextConfig(nextConfig);
        this.onCreateServerHook = (req, res) => {
            if (typeof onCreateServer === 'function') {
                onCreateServer(req, res);
            }
        }
    }

    private createNextApp() {
        this.nextApp = next(this.getNextConfig());
    }

    getNextConfig() {
        return this.nextConfig;
    }

    getNextApp() {
        return this.nextApp;
    }

    setNextConfig(nextConfig: NextServerOptions) {
        if (typeof nextConfig.dev !== "boolean") {
            nextConfig.dev = this.isDev;
        }
        this.nextConfig = nextConfig;
    }

    getHttpServer() {
        return this.httpServer;
    }
    async start() {
        const port = parseInt(process.env.PORT || '3000', 10)
        this.createNextApp();
        const nextApp = this.getNextApp();
        const handle = nextApp.getRequestHandler();

        nextApp.prepare().then(() => {
            this.httpServer = http.createServer(async (req, res) => {
                if (this.useDefaultHeaders) {
                    this.setDefaultHeaders(res);
                }
                await this.onCreateServerHook(req, res);
                const parsedUrl = parse(req.url!, true)
                await handle(req, res, parsedUrl);
            })
            this.httpServer.listen(port)

            console.log(
                `> Server listening at http://localhost:${port} as ${
                    this.isDev ? 'development' : process.env.NODE_ENV
                }`
            )
        });
    }

    private setDefaultHeaders(res) {
        // @TODO: dodać defaultowe headery
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
}

