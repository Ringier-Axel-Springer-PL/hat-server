/// <reference types="node" />
import type { NextServerOptions, NextServer } from "next/dist/server/next";
import * as http from "http";
import { BootServerConfig } from "../types";
export declare class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPI;
    private readonly useControllerParams;
    private readonly useWebsitesAPIRedirects;
    private readonly useDefaultHeaders;
    private readonly useFullQueryParams;
    private readonly enableDebug;
    private nextApp;
    private nextServerConfig;
    private httpServer;
    private readonly onRequestHook;
    private readonly controllerParams;
    private readonly additionalDataInControllerParamsHook;
    private readonly shouldMakeRequestToWebsiteAPIOnThisRequestHook;
    private readonly prepareCustomGraphQLQueryToWebsiteAPIHook;
    constructor({ useFullQueryParams, useDefaultHeaders, useWebsitesAPIRedirects, useControllerParams, useWebsitesAPI, enableDebug, nextServerConfig, onRequest, additionalDataInControllerParams, shouldMakeRequestToWebsiteAPIOnThisRequest, prepareCustomGraphQLQueryToWebsiteAPI, }: BootServerConfig);
    createNextApp(): void;
    getNextConfig(): Partial<import("next/dist/server/dev/next-dev-server").Options>;
    getNextApp(): NextServer;
    setNextConfig(nextServerConfig: NextServerOptions): void;
    getHttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    start(): Promise<void>;
    private applyWebsiteAPILogic;
    private shouldMakeRequestToWebsiteAPIOnThisRequest;
    private setDefaultHeaders;
    private handleWebsitesAPIRedirects;
    private getDefaultQuery;
    private getDataContentQueryAsString;
}
