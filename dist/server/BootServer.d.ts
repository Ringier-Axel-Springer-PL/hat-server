/// <reference types="node" />
import type { NextServerOptions, NextServer } from "next/dist/server/next";
import * as http from "http";
import { RingGqlApiClientResponse } from '@ringpublishing/graphql-api-client';
import { DocumentNode } from 'graphql/language/ast';
import { BootServerConfig, DefaultHatSite } from "../types";
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
    readonly _onRequestHook: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    private readonly controllerParams;
    readonly _additionalDataInControllerParamsHook: (gqlResponse: RingGqlApiClientResponse<DefaultHatSite>) => object;
    readonly _shouldMakeRequestToWebsiteAPIOnThisRequestHook: (req: http.IncomingMessage) => boolean;
    readonly _prepareCustomGraphQLQueryToWebsiteAPIHook: (url: string, variantId: string) => DocumentNode;
    constructor({ useFullQueryParams, useDefaultHeaders, useWebsitesAPIRedirects, useControllerParams, useWebsitesAPI, enableDebug, nextServerConfig, onRequest, additionalDataInControllerParams, shouldMakeRequestToWebsiteAPIOnThisRequest, prepareCustomGraphQLQueryToWebsiteAPI, }: BootServerConfig);
    setNextApp(nextApp: NextServer): void;
    createNextApp(): void;
    getNextConfig(): Partial<import("next/dist/server/dev/next-dev-server").Options>;
    getNextApp(): NextServer;
    setNextConfig(nextServerConfig: NextServerOptions): void;
    getHttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    start(): Promise<void>;
    _requestListener(req: any, res: any): Promise<void>;
    _applyWebsiteAPILogic(req: any, res: any): Promise<boolean>;
    _shouldMakeRequestToWebsiteAPIOnThisRequest(req: any): boolean;
    _setDefaultHeaders(res: any): void;
    _handleWebsitesAPIRedirects(res: any, location: any, statusCode: any): void;
    getQuery(url: any, variantId: any, dataContent: any): DocumentNode;
    getDataContentQueryAsString(): string;
}
