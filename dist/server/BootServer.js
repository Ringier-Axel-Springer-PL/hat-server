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
exports.BootServer = void 0;
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const http = __importStar(require("http"));
const graphql_api_client_1 = require("@ringpublishing/graphql-api-client");
const graphql_tag_1 = require("graphql-tag");
const WEBSITE_API_PUBLIC = process.env.WEBSITE_API_PUBLIC;
const WEBSITE_API_SECRET = process.env.WEBSITE_API_SECRET;
const WEBSITE_API_NAMESPACE_ID = process.env.WEBSITE_API_NAMESPACE_ID;
const WEBSITE_API_DOMAIN = process.env.WEBSITE_API_DOMAIN;
const WEBSITE_API_VARIANT = process.env.WEBSITE_API_VARIANT;
const PORT = Number(process.env.PORT || '3000');
class BootServer {
    constructor({ useFullQueryParams = false, useDefaultHeaders = true, useWebsitesAPIRedirects = true, useControllerParams = true, useWebsitesAPI = true, enableDebug = false, nextServerConfig = {}, onRequest = () => {
    }, additionalDataInControllerParams = () => {
    }, shouldMakeRequestToWebsiteAPIOnThisRequest = () => {
    }, prepareCustomGraphQLQueryToWebsiteAPI = () => {
    }, }) {
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
        };
        this._additionalDataInControllerParamsHook = (gqlResponse) => {
            return additionalDataInControllerParams(gqlResponse) || {};
        };
        this._prepareCustomGraphQLQueryToWebsiteAPIHook = (url, variantId) => {
            const defaultGraphqlQuery = this._getDefaultQuery(url, variantId);
            return prepareCustomGraphQLQueryToWebsiteAPI(url, variantId, this._getDataContentQueryAsString(), defaultGraphqlQuery) || defaultGraphqlQuery;
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
        this.nextServerConfig = nextServerConfig;
    }
    getHttpServer() {
        return this.httpServer;
    }
    async start() {
        try {
            this.createNextApp();
            const nextApp = this.getNextApp();
            return nextApp.prepare().then(() => {
                this.httpServer = http.createServer(this._requestListener);
                this.httpServer.listen(PORT);
                console.log(`> Server listening at http://localhost:${PORT} as ${this.isDev ? 'development' : process.env.NODE_ENV}`);
            });
        }
        catch (e) {
            throw (e);
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
            queryParams = { ...queryParams, ...(0, url_1.parse)(req.url, true) };
        }
        if (req.url) {
            await this.nextApp.render(req, res, req.url, { ...queryParams });
        }
        else {
            await this.nextApp.getRequestHandler()(req, res, (0, url_1.parse)(req.url, true));
        }
        if (this.enableDebug) {
            console.log(`Request ${req.url} took ${performance.now() - perf}ms`);
        }
    }
    async _applyWebsiteAPILogic(req, res) {
        var _a, _b, _c, _d;
        let responseEnded = false;
        if (this._shouldMakeRequestToWebsiteAPIOnThisRequestHook(req)) {
            const websitesApiClient = new graphql_api_client_1.WebsitesApiClient({
                accessKey: WEBSITE_API_PUBLIC,
                secretKey: WEBSITE_API_SECRET,
                spaceUuid: WEBSITE_API_NAMESPACE_ID
            });
            const response = await websitesApiClient.query(this._prepareCustomGraphQLQueryToWebsiteAPIHook(`https://${WEBSITE_API_DOMAIN}${req.url}`, WEBSITE_API_VARIANT));
            if (this.useWebsitesAPIRedirects && ((_a = response.data) === null || _a === void 0 ? void 0 : _a.site.headers.location) && ((_b = response.data) === null || _b === void 0 ? void 0 : _b.site.statusCode)) {
                this._handleWebsitesAPIRedirects(res, (_c = response.data) === null || _c === void 0 ? void 0 : _c.site.headers.location, (_d = response.data) === null || _d === void 0 ? void 0 : _d.site.statusCode);
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
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    _handleWebsitesAPIRedirects(res, location, statusCode) {
        res.writeHead(statusCode, { 'Location': location });
        res.end();
    }
    _getDefaultQuery(url, variantId) {
        return (0, graphql_tag_1.gql) `
            query {
                site (url: "${url}", variantId: "${variantId}") {
                    statusCode,
                    headers {
                        location
                    }
                    ${this._getDataContentQueryAsString()}
                }
            }
        `;
    }
    _getDataContentQueryAsString() {
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
            }`;
    }
}
exports.BootServer = BootServer;
//# sourceMappingURL=BootServer.js.map