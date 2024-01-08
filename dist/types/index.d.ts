/// <reference types="node" />
/// <reference types="node" />
import { ApolloQueryResult } from "@apollo/client";
import { NextParsedUrlQuery, NextUrlWithParsedQuery } from "next/dist/server/request-meta";
import { NextServerOptions } from "next/dist/server/next";
import http from "http";
import { DocumentNode } from "graphql/language/ast";
import { UrlWithParsedQuery } from "url";
export interface BootServerConfig {
    useDefaultHeaders?: boolean;
    useWebsitesAPIRedirects?: boolean;
    useHatControllerParams?: boolean;
    useWebsitesAPI?: boolean;
    useAccRdl?: boolean;
    enableDebug?: boolean;
    healthCheckPathname?: string;
    nextServerConfig?: NextServerOptions;
    onRequest?: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    additionalDataInHatControllerParams?: (gqlResponse: ApolloQueryResult<DefaultHatSite>) => any | void;
    shouldMakeRequestToWebsiteAPIOnThisRequest?: (req: http.IncomingMessage, defaultPathCheckValue: boolean) => boolean | void;
    prepareCustomGraphQLQueryToWebsiteAPI?: (url: string, variantId: string, defaultGraphqlQuery: DocumentNode) => DocumentNode | void;
    shouldSkipNextJsWithWebsiteAPIOnThisRequest?: (req: http.IncomingMessage, defaultPathCheckValue: boolean) => boolean | void;
}
export interface DefaultHatControllerParams {
    gqlResponse: ApolloQueryResult<DefaultHatSite>;
    customData: any;
    urlWithParsedQuery: UrlWithParsedQuery;
    isMobile: boolean;
    websiteManagerVariant: string;
    ringDataLayer: any;
}
export interface HATParsedUrlQuery extends HATUrlQuery, NextParsedUrlQuery {
}
export interface HATUrlWithParsedQuery extends HATUrlQuery, NextUrlWithParsedQuery {
}
export interface HATUrlQuery {
    hatControllerParams: string;
    url: string;
}
export declare type Headers = {
    location: Scalars["URL"];
};
export declare type DefaultHatSite = {
    site: Site;
};
export declare type Site = {
    data: SiteData;
    headers: Headers;
    statusCode: number;
};
export declare type SiteData = {
    content: SiteContent;
    node: SiteNodeId;
};
export declare type SiteContent = Author | CustomAction | SiteNode | Source | Story | Topic;
export declare type Author = {
    __typename: "Author";
    id: Scalars["UUID"];
};
export declare type CustomAction = {
    __typename: "CustomAction";
    id: Scalars["UUID"];
    action: Scalars["String"];
};
export declare type SiteNodeId = {
    id: Scalars["UUID"];
};
export declare type SiteNode = {
    __typename: "SiteNode";
    id: Scalars["UUID"];
    slug: Scalars["String"];
    category: {
        id: Scalars["UUID"];
    };
};
export declare type Source = {
    __typename: "Source";
    id: Scalars["UUID"];
    name: Scalars["String"];
};
export declare type Story = {
    __typename: "Story";
    id: Scalars["UUID"];
    title: Scalars["String"];
};
export declare type Topic = {
    __typename: "Topic";
    id: Scalars["UUID"];
    name: Scalars["String"];
};
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    BigInt: any;
    ContentCursor: any;
    DateTime: any;
    Domain: any;
    ImageURL: any;
    JSONObject: any;
    URL: any;
    UUID: any;
};
