import {parse} from 'url';
import next from 'next';
import type {NextServerOptions, NextServer} from "next/dist/server/next";
import * as http from "http";
import {RingGqlApiClientResponse, WebsitesApiClient} from '@ringpublishing/graphql-api-client';
import {gql} from 'graphql-tag';
import {DocumentNode} from 'graphql/language/ast';
import {
    BootServerConfig,
    DefaultControllerParams,
    DefaultHatSite,
    HATParsedUrlQuery,
    HATSimpleUrlQuery,
    Site
} from "../types";

const accessKey = process.env.WEBSITE_API_PUBLIC!;
const secretKey = process.env.WEBSITE_API_SECRET!;
const spaceUuid = process.env.WEBSITE_API_NAMESPACE_ID!;
const host = process.env.WEBSITE_API_HOST!;
const variant = process.env.WEBSITE_API_VARIANT!;
const port = Number(process.env.PORT || '3000');

// @TODO readme
// @TODO testy

export class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPI: boolean;
    private readonly useControllerParams: boolean;
    private readonly useWebsitesAPIRedirects: boolean;
    private readonly useDefaultHeaders: boolean;
    private readonly useFullQueryParams: boolean;
    private readonly enableDebug: boolean;
    private nextApp: NextServer;
    private nextServerConfig: NextServerOptions;
    private httpServer: http.Server;
    private readonly onRequestHook: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    private readonly controllerParams: DefaultControllerParams;
    private readonly additionalDataInControllerParamsHook: (gqlResponse: RingGqlApiClientResponse<DefaultHatSite>) => object;
    private readonly shouldMakeRequestToWebsiteAPIOnThisRequestHook: (req: http.IncomingMessage) => boolean;
    private readonly prepareCustomGraphQLQueryToWebsiteAPIHook: (url: string, variantId: string) => DocumentNode;

    constructor({
                    useFullQueryParams = false as boolean,
                    useDefaultHeaders = true as boolean,
                    useWebsitesAPIRedirects = true as boolean,
                    useControllerParams = true as boolean,
                    useWebsitesAPI = true as boolean,
                    enableDebug = false as boolean,
                    nextServerConfig = {} as NextServerOptions,
                    onRequest = () => {
                    },
                    additionalDataInControllerParams = () => {
                    },
                    shouldMakeRequestToWebsiteAPIOnThisRequest = () => {
                    },
                    prepareCustomGraphQLQueryToWebsiteAPI = () => {
                    },
                }: BootServerConfig) {
        if (useWebsitesAPI && (!accessKey || !secretKey || !spaceUuid)) {
            throw `Missing: ${(!accessKey && 'accessKey') || ''}${(!secretKey && ' secretKey') || ''}${(!spaceUuid && ' spaceUuid') || ''} for Website API`;
        }

        if (!host || !variant) {
            throw `Missing: ${(!variant && 'variant') || ''}${(!host && ' host') || ''}`;
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
        this.setNextConfig(nextServerConfig);
        this.onRequestHook = (req, res) => {
            onRequest(req, res);
        }
        this.additionalDataInControllerParamsHook = (gqlResponse) => {
            return additionalDataInControllerParams(gqlResponse) || {};
        }
        this.prepareCustomGraphQLQueryToWebsiteAPIHook = (url, variantId) => {
            const defaultGraphqlQuery = this.getDefaultQuery(url, variantId);

            return prepareCustomGraphQLQueryToWebsiteAPI(url, variantId, this.getDataContentQueryAsString(), defaultGraphqlQuery) || defaultGraphqlQuery;
        }
        this.shouldMakeRequestToWebsiteAPIOnThisRequestHook = (req) => {
            const defaultPathCheckValue = this.shouldMakeRequestToWebsiteAPIOnThisRequest(req);

            return shouldMakeRequestToWebsiteAPIOnThisRequest(req, defaultPathCheckValue) || defaultPathCheckValue;
        }
    }

    createNextApp() {
        if (typeof this.nextApp === 'undefined') {
            this.nextApp = next(this.getNextConfig());
        }
    }

    getNextConfig() {
        return this.nextServerConfig;
    }

    getNextApp() {
        return this.nextApp;
    }

    setNextConfig(nextServerConfig: NextServerOptions) {
        if (typeof nextServerConfig.dev !== "boolean") {
            nextServerConfig.dev = this.isDev;
        }
        this.nextServerConfig = nextServerConfig;
    }

    getHttpServer() {
        return this.httpServer;
    }

    async start() {
        try {
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

                    await this.onRequestHook(req, res);

                    if (this.useWebsitesAPI) {
                        if (await this.applyWebsiteAPILogic(req, res)) {
                            return;
                        }
                    }

                    if (this.useControllerParams) {
                        this.controllerParams.customData = this.additionalDataInControllerParamsHook(this.controllerParams.gqlResponse);
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
        if (this.shouldMakeRequestToWebsiteAPIOnThisRequestHook(req)) {
            const websitesApiClient = new WebsitesApiClient({accessKey, secretKey, spaceUuid});
            const response = await websitesApiClient.query(this.prepareCustomGraphQLQueryToWebsiteAPIHook(`https://${host}${req.url}`, variant)) as RingGqlApiClientResponse<DefaultHatSite>

            console.log(response)
            if (this.useWebsitesAPIRedirects && response.data?.site.headers.location && response.data?.site.statusCode) {
                this.handleWebsitesAPIRedirects(res, response.data?.site.headers.location, response.data?.site.statusCode);
                responseEnded = true;
            }

            if (this.useControllerParams) {
                this.controllerParams.gqlResponse = response;
            }
        }

        return responseEnded;
    }

    private shouldMakeRequestToWebsiteAPIOnThisRequest(req) {
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

    private getDefaultQuery(url, variantId)  {
        return gql`
            query {
                site (url: "${url}", variantId: "${variantId}") {
                    statusCode,
                    headers {
                        location
                    }
                    ${this.getDataContentQueryAsString()}
                }
            }
        `;
    }

    private getDataContentQueryAsString() {
        return `
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
            }`
    }
}

