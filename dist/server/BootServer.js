"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.HatControllerParams = exports.BootServer = void 0;
var url_1 = require("url");
var graphql_api_client_1 = require("@ringpublishing/graphql-api-client");
var graphql_tag_1 = require("graphql-tag");
var WEBSITE_API_PUBLIC = process.env.WEBSITE_API_PUBLIC;
var WEBSITE_API_SECRET = process.env.WEBSITE_API_SECRET;
var WEBSITE_API_NAMESPACE_ID = process.env.WEBSITE_API_NAMESPACE_ID;
var NEXT_PUBLIC_WEBSITE_DOMAIN = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;
var NEXT_PUBLIC_WEBSITE_API_VARIANT = process.env.NEXT_PUBLIC_WEBSITE_API_VARIANT;
// process.argv[3] -> cde app start support
var cdePort = Number(process.argv[3]);
var PORT = process.env.PORT || cdePort || 3000;
var BootServer = /** @class */ (function () {
    function BootServer(_a) {
        var _b = _a.useDefaultHeaders, useDefaultHeaders = _b === void 0 ? true : _b, _c = _a.useWebsitesAPIRedirects, useWebsitesAPIRedirects = _c === void 0 ? true : _c, _d = _a.useHatControllerParams, useHatControllerParams = _d === void 0 ? true : _d, _e = _a.useWebsitesAPI, useWebsitesAPI = _e === void 0 ? true : _e, _f = _a.enableDebug, enableDebug = _f === void 0 ? false : _f, _g = _a.healthCheckPathname, healthCheckPathname = _g === void 0 ? '/_healthcheck' : _g, _h = _a.onRequest, onRequest = _h === void 0 ? function () {
        } : _h, _j = _a.additionalDataInHatControllerParams, additionalDataInHatControllerParams = _j === void 0 ? function () {
        } : _j, _k = _a.shouldMakeRequestToWebsiteAPIOnThisRequest, shouldMakeRequestToWebsiteAPIOnThisRequest = _k === void 0 ? function () {
        } : _k, _l = _a.shouldSkipNextJsWithWebsiteAPIOnThisRequest, shouldSkipNextJsWithWebsiteAPIOnThisRequest = _l === void 0 ? function () {
        } : _l, _m = _a.prepareCustomGraphQLQueryToWebsiteAPI, prepareCustomGraphQLQueryToWebsiteAPI = _m === void 0 ? function () {
        } : _m;
        var _this = this;
        var _o;
        if (useWebsitesAPI && (!WEBSITE_API_PUBLIC || !WEBSITE_API_SECRET || !WEBSITE_API_NAMESPACE_ID)) {
            throw "Missing: ".concat((!WEBSITE_API_PUBLIC && 'WEBSITE_API_PUBLIC') || '').concat((!WEBSITE_API_SECRET && ' WEBSITE_API_SECRET') || '').concat((!WEBSITE_API_NAMESPACE_ID && ' WEBSITE_API_NAMESPACE_ID') || '');
        }
        if (!NEXT_PUBLIC_WEBSITE_DOMAIN) {
            throw "Missing: ".concat((!NEXT_PUBLIC_WEBSITE_DOMAIN && 'NEXT_PUBLIC_WEBSITE_DOMAIN') || '');
        }
        // process.env.ONET_SEGMENT?.toLowerCase().startsWith('c_') -> cde app start support
        this.isDev = ((_o = process.env.ONET_SEGMENT) === null || _o === void 0 ? void 0 : _o.toLowerCase().startsWith('c_')) || process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.useWebsitesAPIRedirects = useWebsitesAPIRedirects;
        this.useHatControllerParams = useHatControllerParams;
        this.useWebsitesAPI = useWebsitesAPI;
        this.enableDebug = enableDebug;
        this.healthCheckPathname = healthCheckPathname;
        this._onRequestHook = function (req, res) {
            onRequest(req, res);
        };
        this._additionalDataInHatControllerParamsHook = function (gqlResponse) {
            return additionalDataInHatControllerParams(gqlResponse) || {};
        };
        this._prepareCustomGraphQLQueryToWebsiteAPIHook = function (url, variantId) {
            var defaultGraphqlQuery = _this.getQuery(url, variantId, _this.getDataContentQueryAsString());
            return prepareCustomGraphQLQueryToWebsiteAPI(url, variantId, defaultGraphqlQuery) || defaultGraphqlQuery;
        };
        this._shouldMakeRequestToWebsiteAPIOnThisRequestHook = function (req) {
            var defaultPathCheckValue = _this._shouldMakeRequestToWebsiteAPIOnThisRequest(req);
            return shouldMakeRequestToWebsiteAPIOnThisRequest(req, defaultPathCheckValue) || defaultPathCheckValue;
        };
    }
    /**
     * Return node http server. It's created after start() call.
     */
    BootServer.prototype.getHttpServer = function () {
        return this.httpServer;
    };
    //@TODO req type
    BootServer.prototype._requestListener = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var perf, hatControllerParamsInstance, parsedUrlQuery, variant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        perf = 0;
                        hatControllerParamsInstance = new HatControllerParams();
                        parsedUrlQuery = (0, url_1.parse)(req.url, true);
                        variant = NEXT_PUBLIC_WEBSITE_API_VARIANT;
                        if (req.headers.get('x-websites-config-variant')) {
                            variant = req.headers.get('x-websites-config-variant') || '';
                        }
                        if (parsedUrlQuery.pathname === this.healthCheckPathname) {
                            res.writeHead(200).end('OK');
                            return [2 /*return*/];
                        }
                        if (req.headers.get('host')) {
                            parsedUrlQuery.host = req.headers.get('host');
                            parsedUrlQuery.hostname = (req.headers.get('host') || '').replace(":".concat(PORT), '');
                        }
                        if (this.enableDebug) {
                            perf = performance.now();
                        }
                        if (this.useDefaultHeaders) {
                            this._setDefaultHeaders(res, req);
                        }
                        return [4 /*yield*/, this._onRequestHook(req, res)];
                    case 1:
                        _a.sent();
                        if (!this.useWebsitesAPI) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._applyWebsiteAPILogic(parsedUrlQuery.pathname, req, res, hatControllerParamsInstance, variant)];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
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
                            console.log("Request ".concat(req.url, " took ").concat(performance.now() - perf, "ms"));
                        }
                        return [2 /*return*/, req.headers];
                }
            });
        });
    };
    BootServer.prototype._applyWebsiteAPILogic = function (pathname, req, res, hatControllerParamsInstance, variant) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var responseEnded, perf, response;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        responseEnded = false;
                        if (!this._shouldMakeRequestToWebsiteAPIOnThisRequestHook(req)) return [3 /*break*/, 2];
                        if (!global.websitesApiApolloClient) {
                            global.websitesApiApolloClient = new graphql_api_client_1.WebsitesApiClientBuilder({
                                accessKey: WEBSITE_API_PUBLIC,
                                secretKey: WEBSITE_API_SECRET,
                                spaceUuid: WEBSITE_API_NAMESPACE_ID
                            }).buildApolloClient();
                        }
                        perf = 0;
                        if (this.enableDebug) {
                            perf = performance.now();
                        }
                        return [4 /*yield*/, global.websitesApiApolloClient.query({
                                query: this._prepareCustomGraphQLQueryToWebsiteAPIHook("".concat(NEXT_PUBLIC_WEBSITE_DOMAIN).concat(pathname), variant)
                            })];
                    case 1:
                        response = _h.sent();
                        if (this.enableDebug) {
                            console.log("Website API request '".concat(NEXT_PUBLIC_WEBSITE_DOMAIN).concat(pathname, "' for '").concat(variant, "' variant took ").concat(performance.now() - perf, "ms"));
                        }
                        if (this.useWebsitesAPIRedirects && ((_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.site) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c.location) && ((_e = (_d = response.data) === null || _d === void 0 ? void 0 : _d.site) === null || _e === void 0 ? void 0 : _e.statusCode)) {
                            this._handleWebsitesAPIRedirects(req, res, (_f = response.data) === null || _f === void 0 ? void 0 : _f.site.headers.location, (_g = response.data) === null || _g === void 0 ? void 0 : _g.site.statusCode);
                            responseEnded = true;
                        }
                        if (this.useHatControllerParams) {
                            hatControllerParamsInstance.gqlResponse = response;
                        }
                        _h.label = 2;
                    case 2: return [2 /*return*/, responseEnded];
                }
            });
        });
    };
    BootServer.prototype._shouldMakeRequestToWebsiteAPIOnThisRequest = function (req) {
        var hasUrl = Boolean(req.url);
        var isInternalNextRequest = hasUrl && req.url.includes('_next');
        var isFavicon = hasUrl && req.url.includes('favicon.ico');
        return hasUrl && !isInternalNextRequest && !isFavicon;
    };
    BootServer.prototype._setDefaultHeaders = function (res, req) {
        // @TODO: add default headers
        //res.setHeader('X-Content-Type-Options', 'nosniff');
        req.headers['X-Current-Url'] = req.url;
    };
    BootServer.prototype._handleWebsitesAPIRedirects = function (req, res, location, statusCode) {
        var _a, _b;
        if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.includes('localhost')) {
            var newLocation = new URL(location);
            newLocation.host = 'localhost';
            newLocation.port = "".concat(PORT);
            newLocation.protocol = 'http';
            location = newLocation.toString();
        }
        res.writeHead(statusCode, { 'Location': location });
        res.end();
    };
    /**
     * Returns GraphQl object with nesesery keys.
     */
    BootServer.prototype.getQuery = function (url, variantId, dataContent) {
        return (0, graphql_tag_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            query {\n                site (url: \"", "\", variantId: \"", "\") {\n                    statusCode,\n                    headers {\n                        location\n                    }\n                    ", "\n                }\n            }\n        "], ["\n            query {\n                site (url: \"", "\", variantId: \"", "\") {\n                    statusCode,\n                    headers {\n                        location\n                    }\n                    ", "\n                }\n            }\n        "])), url, variantId, dataContent);
    };
    /**
     * Returns default data content for GraphQl query.
     */
    BootServer.prototype.getDataContentQueryAsString = function () {
        return "\n            data {\n                node {\n                    category {\n                        id\n                    }\n                    id\n                }\n                content {\n                    __typename\n                    ...on Story {\n                        id,\n                        title,\n                        mainPublicationPoint {\n                            id\n                        },\n                        kind {\n                            code\n                        }\n                    }\n                    ...on SiteNode {\n                        id,\n                        slug,\n                        category {\n                          id\n                        }\n                    }\n                    ...on Topic {\n                        id,\n                        name\n                    }\n                    ...on Source{\n                        id,\n                        name\n                    }\n                    ...on Author{\n                        id,\n                        name\n                    }\n                    ...on CustomAction{\n                        id,\n                        action\n                    }\n                }\n            }";
    };
    BootServer.prototype.isMobile = function (req) {
        var headers = req.headers;
        var acceleratorDeviceType = headers.get('x-oa-device-type');
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
        var mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
        var notMobileRE = /CrOS/;
        var ua = headers['user-agent'];
        if (!ua) {
            return false;
        }
        return mobileRE.test(ua) && !notMobileRE.test(ua);
    };
    return BootServer;
}());
exports.BootServer = BootServer;
var HatControllerParams = /** @class */ (function () {
    function HatControllerParams() {
    }
    return HatControllerParams;
}());
exports.HatControllerParams = HatControllerParams;
;
var HatRequest = /** @class */ (function (_super) {
    __extends(HatRequest, _super);
    function HatRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HatRequest;
}(Request));
var templateObject_1;
