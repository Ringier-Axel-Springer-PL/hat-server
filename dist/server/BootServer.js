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
const accessKey = process.env.WEBSITE_API_PUBLIC;
const secretKey = process.env.WEBSITE_API_SECRET;
const spaceUuid = process.env.WEBSITE_API_NAMESPACE_ID;
const getQuery = (url, variantId) => (0, graphql_tag_1.gql) `
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
class BootServer {
    constructor({ useFullQueryParams = false, useDefaultHeaders = true, useWebsitesAPIRedirects = true, useControllerParams = true, useWebsitesAPI = true, enableDebug = false, nextConfig = {}, onCreateServer = (req, res) => { }, onCustomControllerParams = (data) => { }, onPathCheckToUseWebsiteAPI = (req, defaultPathCheckValue) => { }, onCreateGraphqlQuery = (url, variantId, defaultGraphqlQuery) => { }, }) {
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
        };
        this.onCustomControllerParamsHook = (data) => {
            return onCustomControllerParams(data) || {};
        };
        this.onCreateGraphqlQueryHook = (url, variantId) => {
            const defaultGraphqlQuery = getQuery(url, variantId);
            return onCreateGraphqlQuery(url, variantId, defaultGraphqlQuery) || defaultGraphqlQuery;
        };
        this.onPathCheckToUseWebsiteAPIHook = (req) => {
            const defaultPathCheckValue = this.defaultPathCheckToUseWebsiteAPI(req);
            return onPathCheckToUseWebsiteAPI(req, defaultPathCheckValue) || defaultPathCheckValue;
        };
    }
    createNextApp() {
        if (typeof this.nextApp === 'undefined') {
            this.nextApp = (0, next_1.default)(this.getNextConfig());
        }
    }
    getNextConfig() {
        return this.nextConfig;
    }
    getNextApp() {
        return this.nextApp;
    }
    setNextConfig(nextConfig) {
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
            const port = parseInt(process.env.PORT || '3000', 10);
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
                        this.controllerParams.customData = this.onCustomControllerParamsHook(this.controllerParams.gqlResponse);
                    }
                    let queryParams = {
                        url: req.url,
                        controllerParams: this.controllerParams
                    };
                    if (this.useFullQueryParams) {
                        queryParams = { ...queryParams, ...(0, url_1.parse)(req.url, true) };
                    }
                    if (req.url) {
                        await nextApp.render(req, res, req.url, { ...queryParams });
                    }
                    else {
                        await handle(req, res, (0, url_1.parse)(req.url, true));
                    }
                    if (this.enableDebug) {
                        console.log(`Request ${req.url} took ${performance.now() - perf}ms`);
                    }
                });
                this.httpServer.listen(port);
                console.log(`> Server listening at http://localhost:${port} as ${this.isDev ? 'development' : process.env.NODE_ENV}`);
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    async applyWebsiteAPILogic(req, res) {
        var _a, _b, _c, _d, _e;
        let responseEnded = false;
        if (this.onPathCheckToUseWebsiteAPIHook(req)) {
            const websitesApiClient = new graphql_api_client_1.WebsitesApiClient({ accessKey, secretKey, spaceUuid });
            const response = await websitesApiClient.query(this.onCreateGraphqlQueryHook(`https://demo-ring.com${req.url}`, "ALL_FEATURES"));
            if (this.useWebsitesAPIRedirects && ((_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.site) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c.location) && ((_e = (_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.site) === null || _e === void 0 ? void 0 : _e.statusCode)) {
                this.handleWebsitesAPIRedirects(res, response.data.site.headers.location, response.data.site.statusCode);
                responseEnded = true;
            }
            if (this.useControllerParams && response) {
                this.controllerParams.gqlResponse = response;
            }
        }
        return responseEnded;
    }
    defaultPathCheckToUseWebsiteAPI(req) {
        const hasUrl = Boolean(req.url);
        const isInternalNextRequest = hasUrl && req.url.includes('_next');
        const isFavicon = hasUrl && req.url.includes('favicon.icon');
        return hasUrl && !isInternalNextRequest && !isFavicon;
    }
    setDefaultHeaders(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    handleWebsitesAPIRedirects(res, location, statusCode) {
        res.writeHead(statusCode, { 'Location': location });
        res.end();
    }
}
exports.BootServer = BootServer;
//# sourceMappingURL=BootServer.js.map