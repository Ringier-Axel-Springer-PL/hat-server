import {parse, UrlWithParsedQuery} from 'url';
import * as http from "http";
import { WebsitesApiClientBuilder} from '@ringpublishing/graphql-api-client';
import {gql} from 'graphql-tag';
import {DocumentNode} from 'graphql/language/ast';
import {
    BootServerConfig,
    DefaultHatControllerParams,
    DefaultHatSite,
    HATUrlQuery
} from "../types";
import { ApolloQueryResult } from "@apollo/client";

const WEBSITE_API_PUBLIC = process.env.WEBSITE_API_PUBLIC!;
const WEBSITE_API_SECRET = process.env.WEBSITE_API_SECRET!;
const WEBSITE_API_NAMESPACE_ID = process.env.WEBSITE_API_NAMESPACE_ID!;
const NEXT_PUBLIC_WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN!;
const NEXT_PUBLIC_WEBSITE_API_VARIANT = process.env.NEXT_PUBLIC_WEBSITE_API_VARIANT!;
// process.argv[3] -> cde app start support
const cdePort = Number(process.argv[3]);
const PORT = process.env.PORT || cdePort || 3000;

export class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPI: boolean;
    private readonly useHatControllerParams: boolean;
    private readonly useWebsitesAPIRedirects: boolean;
    private readonly useDefaultHeaders: boolean;
    private readonly enableDebug: boolean;
    private readonly healthCheckPathname: string;
    private httpServer: http.Server;
    readonly _onRequestHook: (req: HatRequest, res: http.ServerResponse) => void;
    private readonly hatControllerParams: DefaultHatControllerParams;
    readonly _additionalDataInHatControllerParamsHook: (gqlResponse: ApolloQueryResult<DefaultHatSite>) => object;
    readonly _shouldMakeRequestToWebsiteAPIOnThisRequestHook: (req: http.IncomingMessage) => boolean;
    readonly _prepareCustomGraphQLQueryToWebsiteAPIHook: (url: string, variantId: string) => DocumentNode;

    constructor({
                    useDefaultHeaders = true as boolean,
                    useWebsitesAPIRedirects = true as boolean,
                    useHatControllerParams = true as boolean,
                    useWebsitesAPI = true as boolean,
                    enableDebug = false as boolean,
                    healthCheckPathname = '/_healthcheck' as string,
                    onRequest = () => {
                    },
                    additionalDataInHatControllerParams = () => {
                    },
                    shouldMakeRequestToWebsiteAPIOnThisRequest = () => {
                    },
                    shouldSkipNextJsWithWebsiteAPIOnThisRequest = () => {
                    },
                    prepareCustomGraphQLQueryToWebsiteAPI = () => {
                    },
                }: BootServerConfig) {
        if (useWebsitesAPI && (!WEBSITE_API_PUBLIC || !WEBSITE_API_SECRET || !WEBSITE_API_NAMESPACE_ID)) {
            throw `Missing: ${(!WEBSITE_API_PUBLIC && 'WEBSITE_API_PUBLIC') || ''}${(!WEBSITE_API_SECRET && ' WEBSITE_API_SECRET') || ''}${(!WEBSITE_API_NAMESPACE_ID && ' WEBSITE_API_NAMESPACE_ID') || ''}`;
        }

        if (!NEXT_PUBLIC_WEBSITE_DOMAIN) {
            throw `Missing: ${(!NEXT_PUBLIC_WEBSITE_DOMAIN && 'NEXT_PUBLIC_WEBSITE_DOMAIN') || ''}`;
        }

        // process.env.ONET_SEGMENT?.toLowerCase().startsWith('c_') -> cde app start support
        this.isDev = process.env.ONET_SEGMENT?.toLowerCase().startsWith('c_') || process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.useWebsitesAPIRedirects = useWebsitesAPIRedirects;
        this.useHatControllerParams = useHatControllerParams;
        this.useWebsitesAPI = useWebsitesAPI;
        this.enableDebug = enableDebug;
        this.healthCheckPathname = healthCheckPathname;

        this._onRequestHook = (req: HatRequest, res) => {
            onRequest(req, res);
        }
        this._additionalDataInHatControllerParamsHook = (gqlResponse) => {
            return additionalDataInHatControllerParams(gqlResponse) || {};
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
     * Return node http server. It's created after start() call.
     */
    getHttpServer() {
        return this.httpServer;
    }

    //@TODO req type

    async _requestListener(req: any, res) {
        let perf = 0;

        let hatControllerParamsInstance = new HatControllerParams()
        const parsedUrlQuery: UrlWithParsedQuery = parse(req.url, true);

        let variant = NEXT_PUBLIC_WEBSITE_API_VARIANT;

        if (req.headers.get('x-websites-config-variant')) {
            variant = req.headers.get('x-websites-config-variant') || '';
        }

        if (parsedUrlQuery.pathname === this.healthCheckPathname) {
            res.writeHead(200).end('OK');
            return;
        }

        if (req.headers.get('host')) {
            parsedUrlQuery.host = req.headers.get('host');
            parsedUrlQuery.hostname = (req.headers.get('host') || '').replace(`:${PORT}`, '');
        }

        if (this.enableDebug) {
            perf = performance.now();
        }

        if (this.useDefaultHeaders) {
            this._setDefaultHeaders(res, req);
        }

        await this._onRequestHook(req, res);

        if (this.useWebsitesAPI) {
            if (await this._applyWebsiteAPILogic(parsedUrlQuery.pathname, req, res, hatControllerParamsInstance, variant)) {
                return;
            }
        }

        if (this.useHatControllerParams) {

            hatControllerParamsInstance.customData = this._additionalDataInHatControllerParamsHook(hatControllerParamsInstance.gqlResponse);
            hatControllerParamsInstance.urlWithParsedQuery = parsedUrlQuery;
            hatControllerParamsInstance.isMobile = this.isMobile(req);
            hatControllerParamsInstance.websiteManagerVariant = variant;

            // console.log(JSON.stringify(hatControllerParamsInstance));
            //@TODO put into some allowed field
            req.hatControllerParamsInstance = hatControllerParamsInstance;

        }

        //await this.nextApp.render(req, res, parsedUrlQuery.pathname || req.url, parsedUrlQuery.query);

        if (this.enableDebug) {
            console.log(`Request ${req.url} took ${performance.now() - perf}ms`)
        }

        return req.headers;
    }

    async _applyWebsiteAPILogic(pathname, req, res, hatControllerParamsInstance, variant: string) {
        let responseEnded = false;
        if (this._shouldMakeRequestToWebsiteAPIOnThisRequestHook(req)) {

            if (!global.websitesApiApolloClient) {
                global.websitesApiApolloClient = new WebsitesApiClientBuilder({
                    accessKey: WEBSITE_API_PUBLIC,
                    secretKey: WEBSITE_API_SECRET,
                    spaceUuid: WEBSITE_API_NAMESPACE_ID
                }).buildApolloClient();
            }

            let perf = 0;

            if (this.enableDebug) {
                perf = performance.now();
            }

            const response = await global.websitesApiApolloClient.query({
                query: this._prepareCustomGraphQLQueryToWebsiteAPIHook(`${NEXT_PUBLIC_WEBSITE_DOMAIN}${pathname}`, variant)
            }) as ApolloQueryResult<DefaultHatSite>

            if (this.enableDebug) {
                console.log(`Website API request '${NEXT_PUBLIC_WEBSITE_DOMAIN}${pathname}' for '${variant}' variant took ${performance.now() - perf}ms`)
            }

            if (this.useWebsitesAPIRedirects && response.data?.site?.headers?.location && response.data?.site?.statusCode) {
                this._handleWebsitesAPIRedirects(req, res, response.data?.site.headers.location, response.data?.site.statusCode);
                responseEnded = true;
            }

            if (this.useHatControllerParams) {
                hatControllerParamsInstance.gqlResponse = response;
            }
        }

        return responseEnded;
    }

    _shouldMakeRequestToWebsiteAPIOnThisRequest(req) {
        const hasUrl = Boolean(req.url);
        const isInternalNextRequest = hasUrl && req.url.includes('_next');
        const isFavicon = hasUrl && req.url.includes('favicon.ico');

        return hasUrl && !isInternalNextRequest && !isFavicon;
    }

    _setDefaultHeaders(res, req) {
        // @TODO: add default headers
        //res.setHeader('X-Content-Type-Options', 'nosniff');
        req.headers['X-Current-Url'] = req.url
    }

    _handleWebsitesAPIRedirects(req, res, location, statusCode) {
        if (req.headers?.host?.includes('localhost')) {
            const newLocation = new URL(location);
            newLocation.host = 'localhost';
            newLocation.port = `${PORT}`;
            newLocation.protocol = 'http';

            location = newLocation.toString();
        }
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
                node {
                    category {
                        id
                    }
                    id
                }
                content {
                    __typename
                    ...on Story {
                        id,
                        title,
                        mainPublicationPoint {
                            id
                        },
                        kind {
                            code
                        }
                    }
                    ...on SiteNode {
                        id,
                        slug,
                        category {
                          id
                        }
                    }
                    ...on Topic {
                        id,
                        name
                    }
                    ...on Source{
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

    private isMobile(req: Request): boolean {
        const headers = req.headers;
        const acceleratorDeviceType = headers.get('x-oa-device-type');
        if (acceleratorDeviceType) {
            switch (acceleratorDeviceType) {
                case 'mobile':
                case 'mobile-bot':
                    return true;
                case 'tablet':
                case 'desktop':
                case 'bot':
                case 'facebook-bot':
                default:
                    return false;
            }
        }

        // based on: https://github.com/juliangruber/is-mobile
        const mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
        const notMobileRE = /CrOS/

        const ua = headers.get('user-agent');
        if(!ua) {
            return false
        }

        return mobileRE.test(ua) && !notMobileRE.test(ua);
    }
}

export class HatControllerParams {
    public gqlResponse: any
    public customData: any
    public urlWithParsedQuery: UrlWithParsedQuery
    public isMobile: boolean
    public websiteManagerVariant: string
};

class HatRequest extends Request {
    public hatControllerParamsInstance: HatControllerParams
}
