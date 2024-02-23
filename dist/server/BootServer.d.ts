/// <reference types="node" />
/// <reference types="node" />
import { UrlWithParsedQuery } from 'url';
import type { NextServerOptions, NextServer } from "next/dist/server/next";
import * as http from "http";
import { DocumentNode } from 'graphql/language/ast';
import { BootServerConfig, DefaultHatSite } from "../types";
import { ApolloQueryResult } from "@apollo/client";
export declare class BootServer {
    protected readonly isDev: boolean;
    private readonly useWebsitesAPI;
    private readonly useHatControllerParams;
    private readonly useWebsitesAPIRedirects;
    private readonly useDefaultHeaders;
    private readonly useAccRdl;
    private readonly enableDebug;
    private readonly healthCheckPathname;
    private nextApp;
    private nextServerConfig;
    private httpServer;
    private ringDataLayer;
    readonly _onRequestHook: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    private readonly hatControllerParams;
    readonly _additionalDataInHatControllerParamsHook: (gqlResponse: ApolloQueryResult<DefaultHatSite>) => object;
    readonly _shouldMakeRequestToWebsiteAPIOnThisRequestHook: (req: http.IncomingMessage) => boolean;
    readonly _prepareCustomGraphQLQueryToWebsiteAPIHook: (url: string, variantId: string) => DocumentNode;
    constructor({ useDefaultHeaders, useWebsitesAPIRedirects, useHatControllerParams, useWebsitesAPI, useAccRdl, enableDebug, healthCheckPathname, nextServerConfig, onRequest, additionalDataInHatControllerParams, shouldMakeRequestToWebsiteAPIOnThisRequest, shouldSkipNextJsWithWebsiteAPIOnThisRequest, prepareCustomGraphQLQueryToWebsiteAPI, }: BootServerConfig);
    setNextApp(nextApp: NextServer): void;
    createNextApp(): void;
    getNextConfig(): NextServerOptions;
    getNextApp(): NextServer;
    setNextConfig(nextServerConfig: NextServerOptions): void;
    getHttpServer(): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    start(shouldListen?: boolean): Promise<void>;
    _requestListener(req: any, res: any, hatControllerParamsInstance: any, handle: any): Promise<void>;
    _applyWebsiteAPILogic(pathname: any, req: any, res: any, hatControllerParamsInstance: any, variant: string, ringDataLayer: any): Promise<boolean>;
    _shouldMakeRequestToWebsiteAPIOnThisRequest(req: any): boolean;
    _setDefaultHeaders(res: any, req: any): void;
    _handleWebsitesAPIRedirects(req: any, res: any, location: any, statusCode: any): void;
    getQuery(url: any, variantId: any, dataContent: any): DocumentNode;
    getDataContentQueryAsString(): string;
    private isMobile;
}
export declare class HatControllerParams {
    gqlResponse: any;
    customData: any;
    urlWithParsedQuery: UrlWithParsedQuery;
    isMobile: boolean;
    websiteManagerVariant: string;
}
