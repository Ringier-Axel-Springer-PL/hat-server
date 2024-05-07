"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HatControllerParams = exports.BootServer = void 0;
const url_1 = require("url");
const graphql_api_client_1 = require("@ringpublishing/graphql-api-client");
const graphql_tag_1 = require("graphql-tag");
const WEBSITE_API_PUBLIC = process.env.WEBSITE_API_PUBLIC;
const WEBSITE_API_SECRET = process.env.WEBSITE_API_SECRET;
const WEBSITE_API_NAMESPACE_ID = process.env.WEBSITE_API_NAMESPACE_ID;
const NEXT_PUBLIC_WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;
const NEXT_PUBLIC_WEBSITE_API_VARIANT = process.env.NEXT_PUBLIC_WEBSITE_API_VARIANT;
const cdePort = Number(process.argv[3]);
const PORT = process.env.PORT || cdePort || 3000;
class BootServer {
    constructor({ useDefaultHeaders = true, useWebsitesAPIRedirects = true, useHatControllerParams = true, useWebsitesAPI = true, enableDebug = false, healthCheckPathname = '/_healthcheck', onRequest = () => {
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
        this.enableDebug = enableDebug;
        this.healthCheckPathname = healthCheckPathname;
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
    getHttpServer() {
        return this.httpServer;
    }
    async _requestListener(req, res) {
        let perf = 0;
        let hatControllerParamsInstance = new HatControllerParams();
        const parsedUrlQuery = (0, url_1.parse)(req.url, true);
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
            req.hatControllerParamsInstance = hatControllerParamsInstance;
        }
        if (this.enableDebug) {
            console.log(`Request ${req.url} took ${performance.now() - perf}ms`);
        }
        return req.headers;
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
            }`;
    }
    isMobile(req) {
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
class HatRequest extends Request {
}
//# sourceMappingURL=BootServer.js.map