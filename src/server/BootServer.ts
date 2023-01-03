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
    HATParsedUrlQuery
} from "../types";

const WEBSITE_API_PUBLIC = process.env.WEBSITE_API_PUBLIC!;
const WEBSITE_API_SECRET = process.env.WEBSITE_API_SECRET!;
const WEBSITE_API_NAMESPACE_ID = process.env.WEBSITE_API_NAMESPACE_ID!;
// tylko dla locala, na acc z req
const WEBSITE_API_DOMAIN = process.env.WEBSITE_API_DOMAIN!;
// variant z headersow
const WEBSITE_API_VARIANT = process.env.WEBSITE_API_VARIANT!;
const PORT = Number(process.env.PORT || '3000');

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
    readonly _onRequestHook: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    private readonly controllerParams: DefaultControllerParams;
    readonly _additionalDataInControllerParamsHook: (gqlResponse: RingGqlApiClientResponse<DefaultHatSite>) => object;
    readonly _shouldMakeRequestToWebsiteAPIOnThisRequestHook: (req: http.IncomingMessage) => boolean;
    readonly _prepareCustomGraphQLQueryToWebsiteAPIHook: (url: string, variantId: string) => DocumentNode;

    constructor({
                    useFullQueryParams = true as boolean,
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
        if (useWebsitesAPI && (!WEBSITE_API_PUBLIC || !WEBSITE_API_SECRET || !WEBSITE_API_NAMESPACE_ID)) {
            throw `Missing: ${(!WEBSITE_API_PUBLIC && 'WEBSITE_API_PUBLIC') || ''}${(!WEBSITE_API_SECRET && ' WEBSITE_API_SECRET') || ''}${(!WEBSITE_API_NAMESPACE_ID && ' WEBSITE_API_NAMESPACE_ID') || ''}`;
        }

        if (!WEBSITE_API_DOMAIN || !WEBSITE_API_VARIANT) {
            throw `Missing: ${(!WEBSITE_API_VARIANT && 'WEBSITE_API_VARIANT') || ''}${(!WEBSITE_API_DOMAIN && ' WEBSITE_API_DOMAIN') || ''}`;
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
        this._onRequestHook = (req, res) => {
            onRequest(req, res);
        }
        this._additionalDataInControllerParamsHook = (gqlResponse) => {
            return additionalDataInControllerParams(gqlResponse) || {};
        }
        this._prepareCustomGraphQLQueryToWebsiteAPIHook = (url, variantId) => {
            const defaultGraphqlQuery = this.getQuery(url, variantId, this.getDataContentQueryAsString());

            return prepareCustomGraphQLQueryToWebsiteAPI(url, variantId, defaultGraphqlQuery) || defaultGraphqlQuery;
        }
        this._shouldMakeRequestToWebsiteAPIOnThisRequestHook = (req) => {
            const defaultPathCheckValue = this._shouldMakeRequestToWebsiteAPIOnThisRequest(req);

            return shouldMakeRequestToWebsiteAPIOnThisRequest(req, defaultPathCheckValue) || defaultPathCheckValue;
        }
    }

    /**
     * Sets Next server.
     */
    setNextApp(nextApp: NextServer) {
        this.nextApp = nextApp;
    }

    /**
     * Creates Next server based on current config. Creates only once.
     */
    createNextApp() {
        if (typeof this.nextApp === 'undefined') {
            this.nextApp = next(this.getNextConfig());
        }
    }

    /**
     * Returns Next server config.
     */
    getNextConfig() {
        return this.nextServerConfig;
    }

    /**
     * Returns Next server.
     */
    getNextApp() {
        return this.nextApp;
    }

    /**
     * Sets Next server config.
     */
    setNextConfig(nextServerConfig: NextServerOptions) {
        if (typeof nextServerConfig.dev !== "boolean") {
            nextServerConfig.dev = this.isDev;
        }
        this.nextServerConfig = nextServerConfig;
    }

    /**
     * Return node http server. It's created after start() call.
     */
    getHttpServer() {
        return this.httpServer;
    }

    /**
     * Function runs Next server and creates the http server and start listening it on configured port.
     */
    async start():Promise<void> {
        try {
            this.createNextApp();
            const nextApp = this.getNextApp();

            return nextApp.prepare().then(() => {
                this.httpServer = http.createServer((req, res) => this._requestListener(req, res))
                this.httpServer.listen(PORT)

                console.log(
                    `> Server listening at http://localhost:${PORT} as ${
                        this.isDev ? 'development' : process.env.NODE_ENV
                    }`
                )
            });
        } catch (e) {
            throw(e);
        }
    }
    async _requestListener(req, res) {
        let perf = 0;

        if (this.enableDebug) {
            perf = performance.now();
        }

        if (this.useDefaultHeaders) {
            this._setDefaultHeaders(res);
        }

        await this._onRequestHook(req, res);

        if (this.useWebsitesAPI) {
            if (await this._applyWebsiteAPILogic(req, res)) {
                return;
            }
        }

        if (this.useControllerParams) {
            this.controllerParams.customData = this._additionalDataInControllerParamsHook(this.controllerParams.gqlResponse);
        }

        let queryParams = {
            url: req.url,
            controllerParams: this.controllerParams
        };

        if (this.useFullQueryParams) {
            queryParams = {...queryParams, ...parse(req.url!, true)};
        }

        if (req.url) {
            await this.nextApp.render(req, res, req.url, {...queryParams} as HATParsedUrlQuery)
        } else {
            await this.nextApp.getRequestHandler()(req, res, parse(req.url!, true));
        }

        if (this.enableDebug) {
            console.log(`Request ${req.url} took ${performance.now() - perf}ms`)
        }
    }

    async _applyWebsiteAPILogic(req, res) {
        let responseEnded = false;
        if (this._shouldMakeRequestToWebsiteAPIOnThisRequestHook(req)) {
            const websitesApiClient = new WebsitesApiClient({
                accessKey: WEBSITE_API_PUBLIC,
                secretKey: WEBSITE_API_SECRET,
                spaceUuid: WEBSITE_API_NAMESPACE_ID
            });
            const response = await websitesApiClient.query(this._prepareCustomGraphQLQueryToWebsiteAPIHook(`${WEBSITE_API_DOMAIN}${req.url}`, WEBSITE_API_VARIANT)) as RingGqlApiClientResponse<DefaultHatSite>

            if (this.useWebsitesAPIRedirects && response.data?.site?.headers?.location && response.data?.site?.statusCode) {
                this._handleWebsitesAPIRedirects(res, response.data?.site.headers.location, response.data?.site.statusCode);
                responseEnded = true;
            }

            if (this.useControllerParams) {
                this.controllerParams.gqlResponse = response;
            }
        }

        return responseEnded;
    }

    _shouldMakeRequestToWebsiteAPIOnThisRequest(req) {
        const hasUrl = Boolean(req.url);
        const isInternalNextRequest = hasUrl && req.url.includes('_next');
        const isFavicon = hasUrl && req.url.includes('favicon.icon');

        return hasUrl && !isInternalNextRequest && !isFavicon;
    }

    _setDefaultHeaders(res) {
        // @TODO: dodać defaultowe headery
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    _handleWebsitesAPIRedirects(res, location, statusCode) {
        res.writeHead(statusCode, {'Location': location});
        res.end();
    }

    /**
     * Returns GraphQl object with nesesery keys.
     */
    getQuery(url, variantId, dataContent)  {
        return gql`
            query {
                site (url: "${url}", variantId: "${variantId}") {
                    statusCode,
                    headers {
                        location
                    }
                    ${dataContent}
                }
            }
        `;
    }

    /**
     * Returns default data content for GraphQl query.
     */
    getDataContentQueryAsString() {
        return `
            data {
                content {
                    __typename
                    ...on Story {
                        id,
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

