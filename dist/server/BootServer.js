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
class BootServer {
    constructor({ useDefaultHeaders = true, useWebsitesAPIRedirects = true, nextConfig = {}, onCreateServer = {} }) {
        this.isDev = process.env.NODE_ENV !== 'production';
        this.useDefaultHeaders = useDefaultHeaders;
        this.useWebsitesAPIRedirects = useWebsitesAPIRedirects;
        this.setNextConfig(nextConfig);
        this.onCreateServerHook = (req, res) => {
            if (typeof onCreateServer === 'function') {
                onCreateServer(req, res);
            }
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
        const port = parseInt(process.env.PORT || '3000', 10);
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
                const parsedUrl = (0, url_1.parse)(req.url, true);
                await handle(req, res, parsedUrl);
            });
            this.httpServer.listen(port);
            console.log(`> Server listening at http://localhost:${port} as ${this.isDev ? 'development' : process.env.NODE_ENV}`);
        });
    }
    setDefaultHeaders(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    handleWebsitesAPIRedirects(res) {
    }
}
exports.BootServer = BootServer;
//# sourceMappingURL=BootServer.js.map