import {parse} from 'url'
import next from 'next'
import {NextServer, NextServerOptions} from "next/dist/server/next";
import * as http from "http";


export class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPIRedirects: boolean;
    private readonly useDefaultHeaders: boolean;
    private nextApp: NextServer;
    private nextConfig: NextServerOptions;
    private httpServer: http.Server;
    private readonly onCreateServerHook: Function;

    constructor({useDefaultHeaders= true as boolean, useWebsitesAPIRedirects= true as boolean, nextConfig = {} as NextServerOptions, onCreateServer = {} as Function}) {
        this.isDev = process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.useWebsitesAPIRedirects = useWebsitesAPIRedirects;
        this.setNextConfig(nextConfig);
        this.onCreateServerHook = (req, res) => {
            if (typeof onCreateServer === 'function') {
                onCreateServer(req, res);}
        }
    }

    createNextApp() {
        if (typeof this.nextApp === 'undefined') {
            this.nextApp = next(this.getNextConfig());
        }
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
        try {
            const port = parseInt(process.env.PORT || '3000', 10)
            this.createNextApp();
            const nextApp = this.getNextApp();
            const handle = nextApp.getRequestHandler();

            nextApp.prepare().then(() => {
                this.httpServer = http.createServer(async (req, res) => {
                    if (this.useDefaultHeaders) {
                        this.setDefaultHeaders(res);
                    }
                    if (this.useWebsitesAPIRedirects) {
                        this.handleWebsitesAPIRedirects(res);
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
        } catch (e) {
            console.error(e);
        }
    }

    private setDefaultHeaders(res) {
        // @TODO: dodać defaultowe headery
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    private handleWebsitesAPIRedirects(res) {
        // @todo: dodac redirecty
        // res.writeHead(302, {'Location': 'https://example.com'});
        // res.end();
    }
}

