/// <reference types="node" />
import { NextServer, NextServerOptions } from "next/dist/server/next";
import * as http from "http";
export declare class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPIRedirects;
    private readonly useDefaultHeaders;
    private nextApp;
    private nextConfig;
    private httpServer;
    private readonly onCreateServerHook;
    constructor({ useDefaultHeaders, useWebsitesAPIRedirects, nextConfig, onCreateServer }: {
        useDefaultHeaders?: boolean | undefined;
        useWebsitesAPIRedirects?: boolean | undefined;
        nextConfig?: Partial<import("next/dist/server/dev/next-dev-server").Options> | undefined;
        onCreateServer?: Function | undefined;
    });
    createNextApp(): void;
    getNextConfig(): Partial<import("next/dist/server/dev/next-dev-server").Options>;
    getNextApp(): NextServer;
    setNextConfig(nextConfig: NextServerOptions): void;
    getHttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    start(): Promise<void>;
    private setDefaultHeaders;
    private handleWebsitesAPIRedirects;
}
