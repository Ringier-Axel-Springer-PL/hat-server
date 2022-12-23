/// <reference types="node" />
import type { NextServerOptions, NextServer } from "next/dist/server/next";
import * as http from "http";
import { DocumentNode } from 'graphql/language/ast';
export declare class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPI;
    private readonly useControllerParams;
    private readonly useWebsitesAPIRedirects;
    private readonly useDefaultHeaders;
    private readonly useFullQueryParams;
    private readonly enableDebug;
    private nextApp;
    private nextConfig;
    private httpServer;
    private readonly onCreateServerHook;
    private readonly controllerParams;
    private readonly onCustomControllerParamsHook;
    private readonly onPathCheckToUseWebsiteAPIHook;
    private readonly onCreateGraphqlQueryHook;
    constructor({ useFullQueryParams, useDefaultHeaders, useWebsitesAPIRedirects, useControllerParams, useWebsitesAPI, enableDebug, nextConfig, onCreateServer, onCustomControllerParams, onPathCheckToUseWebsiteAPI, onCreateGraphqlQuery, }: {
        useFullQueryParams?: boolean | undefined;
        useDefaultHeaders?: boolean | undefined;
        useWebsitesAPIRedirects?: boolean | undefined;
        useControllerParams?: boolean | undefined;
        useWebsitesAPI?: boolean | undefined;
        enableDebug?: boolean | undefined;
        nextConfig?: Partial<import("next/dist/server/dev/next-dev-server").Options> | undefined;
        onCreateServer?: ((req: http.IncomingMessage, res: http.ServerResponse) => void) | undefined;
        onCustomControllerParams?: ((data: any) => any | void) | undefined;
        onPathCheckToUseWebsiteAPI?: ((req: http.IncomingMessage, defaultPathCheckValue: boolean) => boolean | void) | undefined;
        onCreateGraphqlQuery?: ((url: string, variantId: string, defaultGraphqlQuery: DocumentNode) => DocumentNode | void) | undefined;
    });
    createNextApp(): void;
    getNextConfig(): Partial<import("next/dist/server/dev/next-dev-server").Options>;
    getNextApp(): NextServer;
    setNextConfig(nextConfig: NextServerOptions): void;
    getHttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    start(): Promise<void>;
    private applyWebsiteAPILogic;
    private defaultPathCheckToUseWebsiteAPI;
    private setDefaultHeaders;
    private handleWebsitesAPIRedirects;
}
