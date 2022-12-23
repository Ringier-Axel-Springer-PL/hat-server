import {parse} from 'url';
import next from 'next';
import type {NextServerOptions, NextServer} from "next/dist/server/next";
import * as http from "http";
import {RingGqlApiClientResponse, WebsitesApiClient} from '@ringpublishing/graphql-api-client';
import {gql} from 'graphql-tag';
import { DocumentNode } from 'graphql/language/ast';
import {DefaultControllerParams, HATParsedUrlQuery, HATSimpleUrlQuery, Site} from "../types";

const accessKey = process.env.WEBSITE_API_PUBLIC!;
const secretKey = process.env.WEBSITE_API_SECRET!;
const spaceUuid = process.env.WEBSITE_API_NAMESPACE_ID!;


// @TODO do podmienienia data { jako zmienna jako czysty string
// @TODO lepsze nazwy dla hookow
// @TODO doc blocks
// @TODO readme
// @TODO testy

const getQuery = (url, variantId) => gql`
    query {
        site (url: "${url}", variantId: "${variantId}"){
            statusCode,
            headers {
                location
            }
            data {
                content {
                    __typename
                    ...on Story {
                        id
                        title
                    }
                    ...on SiteNode {
                        id,
                        slug
                    }
                    ...on Topic {
                        id,
                        name
                    }
                    ...on  Source{
                        id,
                        name
                    }
                    ...on Author{
                        id,
                        name
                    }
                    ...on CustomAction{
                        id,
                        action
                    }
                }
            }
        }
    }
`;

export class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPI: boolean;
    private readonly useControllerParams: boolean;
    private readonly useWebsitesAPIRedirects: boolean;
    private readonly useDefaultHeaders: boolean;
    private readonly useFullQueryParams: boolean;
    private readonly enableDebug: boolean;
    private nextApp: NextServer;
    private nextConfig: NextServerOptions;
    private httpServer: http.Server;
    private readonly onCreateServerHook: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    private readonly controllerParams: DefaultControllerParams;
    private readonly onCustomControllerParamsHook: (gqlResponse: RingGqlApiClientResponse<any>) => object;
    private readonly onPathCheckToUseWebsiteAPIHook: (req: http.IncomingMessage) => boolean;
    private readonly onCreateGraphqlQueryHook: (url: string, variantId: string) => DocumentNode;
    constructor({
                    useFullQueryParams = false as boolean,
                    useDefaultHeaders = true as boolean,
                    useWebsitesAPIRedirects = true as boolean,
                    useControllerParams = true as boolean,
                    useWebsitesAPI = true as boolean,
                    enableDebug = false as boolean,
                    nextConfig = {} as NextServerOptions,
                    onCreateServer = (req: http.IncomingMessage, res: http.ServerResponse): void => {},
                    onCustomControllerParams = (data: any): any | void => {},
                    onPathCheckToUseWebsiteAPI = (req: http.IncomingMessage, defaultPathCheckValue: boolean): boolean | void => {},
                    onCreateGraphqlQuery = (url: string, variantId: string, defaultGraphqlQuery: DocumentNode): DocumentNode | void => {},
                }) {
        if (useWebsitesAPI && (!accessKey || !secretKey || !spaceUuid)) {
            throw `Missing: ${(!accessKey && 'accessKey') || ''}${(!secretKey && ' secretKey') || ''}${(!spaceUuid && ' spaceUuid') || ''} for Website API`;
        }

        this.isDev = process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.useWebsitesAPIRedirects = useWebsitesAPIRedirects;
        this.useFullQueryParams = useFullQueryParams;
        this.useControllerParams = useControllerParams;
        this.useWebsitesAPI = useWebsitesAPI;
        this.enableDebug = enableDebug;
        this.controllerParams = {
            gqlResponse: {},
            customData: {}
        };
        this.setNextConfig(nextConfig);
        this.onCreateServerHook = (req, res) => {
            onCreateServer(req, res);
        }
        this.onCustomControllerParamsHook = (data) => {
            return onCustomControllerParams(data) || {};
        }
        this.onCreateGraphqlQueryHook = (url, variantId) => {
            const defaultGraphqlQuery = getQuery(url, variantId);

            return onCreateGraphqlQuery(url, variantId, defaultGraphqlQuery) || defaultGraphqlQuery;
        }
        this.onPathCheckToUseWebsiteAPIHook = (req) => {
            const defaultPathCheckValue = this.defaultPathCheckToUseWebsiteAPI(req);

            return onPathCheckToUseWebsiteAPI(req, defaultPathCheckValue) || defaultPathCheckValue;
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
                    let perf = 0;

                    if (this.enableDebug) {
                        perf = performance.now();
                    }

                    if (this.useDefaultHeaders) {
                        this.setDefaultHeaders(res);
                    }

                    await this.onCreateServerHook(req, res);

                    if (this.useWebsitesAPI) {
                        if (await this.applyWebsiteAPILogic(req, res)) {
                            return;
                        }
                    }

                    if (this.useControllerParams) {
                        // onCreate..
                        this.controllerParams.customData = this.onCustomControllerParamsHook(this.controllerParams.gqlResponse);
                    }

                    let queryParams = {
                        url: req.url,
                        controllerParams: this.controllerParams
                    };

                    if (this.useFullQueryParams) {
                        queryParams = {...queryParams, ...parse(req.url!, true)};
                    }

                    if (req.url) {
                        await nextApp.render(req, res, req.url, {...queryParams} as HATParsedUrlQuery)
                    } else {
                        await handle(req, res, parse(req.url!, true));
                    }

                    if (this.enableDebug) {
                        console.log(`Request ${req.url} took ${performance.now() - perf}ms`)
                    }
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

    private async applyWebsiteAPILogic(req, res) {
        let responseEnded = false;
        if (this.onPathCheckToUseWebsiteAPIHook(req)) {
            // @TODO https://demo-ring.com podmienic
            const websitesApiClient = new WebsitesApiClient({accessKey, secretKey, spaceUuid});
            const response = await websitesApiClient.query(this.onCreateGraphqlQueryHook(`https://demo-ring.com${req.url}`, "ALL_FEATURES"));

            // @ts-ignore
            if (this.useWebsitesAPIRedirects && response?.data?.site?.headers?.location && response?.data?.site?.statusCode) {
                // @ts-ignore
                this.handleWebsitesAPIRedirects(res, response.data.site.headers.location, response.data.site.statusCode);
                responseEnded = true;
            }

            if (this.useControllerParams && response) {
                this.controllerParams.gqlResponse = response as RingGqlApiClientResponse<Site>;
            }
        }

        return responseEnded;
    }

    private defaultPathCheckToUseWebsiteAPI(req) {
        const hasUrl = Boolean(req.url);
        const isInternalNextRequest = hasUrl && req.url.includes('_next');
        const isFavicon = hasUrl && req.url.includes('favicon.icon');

        return hasUrl && !isInternalNextRequest && !isFavicon;
    }

    private setDefaultHeaders(res) {
        // @TODO: dodać defaultowe headery
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    private handleWebsitesAPIRedirects(res, location, statusCode) {
        res.writeHead(statusCode, {'Location': location});
        res.end();
    }
}

