"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HatControllerParams = exports.BootServer = void 0;
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const http = __importStar(require("http"));
const graphql_api_client_1 = require("@ringpublishing/graphql-api-client");
const graphql_tag_1 = require("graphql-tag");
const RingDataLayer_1 = require("./RingDataLayer");
const WEBSITE_API_PUBLIC = process.env.WEBSITE_API_PUBLIC;
const WEBSITE_API_SECRET = process.env.WEBSITE_API_SECRET;
const WEBSITE_API_NAMESPACE_ID = process.env.WEBSITE_API_NAMESPACE_ID;
const NEXT_PUBLIC_WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;
const NEXT_PUBLIC_WEBSITE_API_VARIANT = process.env.NEXT_PUBLIC_WEBSITE_API_VARIANT;
const cdePort = Number(process.argv[3]);
const PORT = process.env.PORT || cdePort || 3000;
class BootServer {
    constructor({ useDefaultHeaders = true, useWebsitesAPIRedirects = true, useHatControllerParams = true, useWebsitesAPI = true, useAccRdl = true, enableDebug = false, healthCheckPathname = '/_healthcheck', nextServerConfig = {}, onRequest = () => {
    }, additionalDataInHatControllerParams = () => {
    }, shouldMakeRequestToWebsiteAPIOnThisRequest = () => {
    }, shouldSkipNextJsWithWebsiteAPIOnThisRequest = () => {
    }, prepareCustomGraphQLQueryToWebsiteAPI = () => {
    }, }) {
        var _a;
        if (useWebsitesAPI && (!WEBSITE_API_PUBLIC || !WEBSITE_API_SECRET || !WEBSITE_API_NAMESPACE_ID)) {
            throw `Missing: ${(!WEBSITE_API_PUBLIC && 'WEBSITE_API_PUBLIC') || ''}${(!WEBSITE_API_SECRET && ' WEBSITE_API_SECRET') || ''}${(!WEBSITE_API_NAMESPACE_ID && ' WEBSITE_API_NAMESPACE_ID') || ''}`;
        }
        if (!NEXT_PUBLIC_WEBSITE_DOMAIN) {
            throw `Missing: ${(!NEXT_PUBLIC_WEBSITE_DOMAIN && 'NEXT_PUBLIC_WEBSITE_DOMAIN') || ''}`;
        }
        this.isDev = ((_a = process.env.ONET_SEGMENT) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith('c_')) || process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.useWebsitesAPIRedirects = useWebsitesAPIRedirects;
        this.useHatControllerParams = useHatControllerParams;
        this.useWebsitesAPI = useWebsitesAPI;
        this.useAccRdl = useAccRdl;
        this.enableDebug = enableDebug;
        this.healthCheckPathname = healthCheckPathname;
        this.ringDataLayer = new RingDataLayer_1.RingDataLayer();
        this.setNextConfig(nextServerConfig);
        this._onRequestHook = (req, res) => {
            onRequest(req, res);
        };
        this._additionalDataInHatControllerParamsHook = (gqlResponse) => {
            return additionalDataInHatControllerParams(gqlResponse) || {};
        };
        this._prepareCustomGraphQLQueryToWebsiteAPIHook = (url, variantId) => {
            const defaultGraphqlQuery = this.getQuery(url, variantId, this.getDataContentQueryAsString());
            return prepareCustomGraphQLQueryToWebsiteAPI(url, variantId, defaultGraphqlQuery) || defaultGraphqlQuery;
        };
        this._shouldMakeRequestToWebsiteAPIOnThisRequestHook = (req) => {
            const defaultPathCheckValue = this._shouldMakeRequestToWebsiteAPIOnThisRequest(req);
            return shouldMakeRequestToWebsiteAPIOnThisRequest(req, defaultPathCheckValue) || defaultPathCheckValue;
        };
    }
    setNextApp(nextApp) {
        this.nextApp = nextApp;
    }
    createNextApp() {
        if (typeof this.nextApp === 'undefined') {
            this.nextApp = (0, next_1.default)(this.getNextConfig());
        }
    }
    getNextConfig() {
        return this.nextServerConfig;
    }
    getNextApp() {
        return this.nextApp;
    }
    setNextConfig(nextServerConfig) {
        if (typeof nextServerConfig.dev !== "boolean") {
            nextServerConfig.dev = this.isDev;
        }
        nextServerConfig.customServer = true;
        this.nextServerConfig = nextServerConfig;
    }
    getHttpServer() {
        return this.httpServer;
    }
    async start(shouldListen = true) {
        try {
            this.createNextApp();
            const nextApp = this.getNextApp();
            const handle = nextApp.getRequestHandler();
            return nextApp.prepare().then(() => {
                this.httpServer = http.createServer((req, res) => this._requestListener(req, res, new HatControllerParams(), handle));
                if (shouldListen) {
                    this.httpServer.listen(PORT);
                    console.log(`> Server listening at http://localhost:${PORT} as ${this.isDev ? 'development' : process.env.NODE_ENV}`);
                }
            });
        }
        catch (e) {
            throw (e);
        }
    }
    async _requestListener(req, res, hatControllerParamsInstance, handle) {
        var _a;
        let perf = 0;
        const parsedUrlQuery = (0, url_1.parse)(req.url, true);
        let variant = NEXT_PUBLIC_WEBSITE_API_VARIANT;
        if (req.headers['x-websites-config-variant']) {
            variant = req.headers['x-websites-config-variant'];
        }
        if (parsedUrlQuery.pathname === this.healthCheckPathname) {
            res.writeHead(200).end('OK');
            return;
        }
        if ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.host) {
            parsedUrlQuery.host = req.headers.host;
            parsedUrlQuery.hostname = req.headers.host.replace(`:${PORT}`, '');
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
            hatControllerParamsInstance.ringDataLayer = this.ringDataLayer.getRingDataLayer(parsedUrlQuery.pathname, hatControllerParamsInstance.gqlResponse);
            req.headers['X-Controller-Params'] = JSON.stringify(hatControllerParamsInstance);
        }
        await this.nextApp.render(req, res, parsedUrlQuery.pathname || req.url, parsedUrlQuery.query);
        if (this.enableDebug) {
            console.log(`Request ${req.url} took ${performance.now() - perf}ms`);
        }
    }
    async _applyWebsiteAPILogic(pathname, req, res, hatControllerParamsInstance, variant) {
        var _a, _b, _c, _d, _e, _f, _g;
        let responseEnded = false;
        if (this._shouldMakeRequestToWebsiteAPIOnThisRequestHook(req)) {
            if (!global.websitesApiApolloClient) {
                global.websitesApiApolloClient = new graphql_api_client_1.WebsitesApiClientBuilder({
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
            });
            if (this.enableDebug) {
                console.log(`Website API request '${NEXT_PUBLIC_WEBSITE_DOMAIN}${pathname}' for '${variant}' variant took ${performance.now() - perf}ms`);
            }
            if (this.useAccRdl) {
                res.setHeader('x-acc-rdl', this.ringDataLayer.encode(this.ringDataLayer.getRingDataLayer(pathname, response)));
            }
            if (this.useWebsitesAPIRedirects && ((_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.site) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c.location) && ((_e = (_d = response.data) === null || _d === void 0 ? void 0 : _d.site) === null || _e === void 0 ? void 0 : _e.statusCode)) {
                this._handleWebsitesAPIRedirects(req, res, (_f = response.data) === null || _f === void 0 ? void 0 : _f.site.headers.location, (_g = response.data) === null || _g === void 0 ? void 0 : _g.site.statusCode);
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
        res.setHeader('X-Content-Type-Options', 'nosniff');
        req.headers['X-Current-Url'] = req.url;
    }
    _handleWebsitesAPIRedirects(req, res, location, statusCode) {
        var _a, _b;
        if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.includes('localhost')) {
            const newLocation = new URL(location);
            newLocation.host = 'localhost';
            newLocation.port = `${PORT}`;
            newLocation.protocol = 'http';
            location = newLocation.toString();
        }
        res.writeHead(statusCode, { 'Location': location });
        res.end();
    }
    getQuery(url, variantId, dataContent) {
        return (0, graphql_tag_1.gql) `
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
    getDataContentQueryAsString() {
        return `
            data {
                node {
                    breadcrumbs {
                        slug
                    }
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
                        name,
                        publicationPoint {
                            id
                        }
                    }
                    ...on Source{
                        id,
                        name,
                        publicationPoint {
                            id
                        }
                    }
                    ...on Author{
                        id,
                        name,
                        publicationPoint {
                            id
                        }
                    }
                    ...on CustomAction{
                        id,
                        action
                    }
                }
            }`;
    }
    isMobile(req) {
        const headers = req.headers;
        const acceleratorDeviceType = headers['x-oa-device-type'];
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
        const mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
        const notMobileRE = /CrOS/;
        const ua = headers['user-agent'];
        if (!ua) {
            return false;
        }
        return mobileRE.test(ua) && !notMobileRE.test(ua);
    }
}
exports.BootServer = BootServer;
class HatControllerParams {
}
exports.HatControllerParams = HatControllerParams;
;
//# sourceMappingURL=BootServer.js.map