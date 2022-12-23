/// <reference types="node" />
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { RingGqlApiClientResponse } from "@ringpublishing/graphql-api-client";
import { NextServerOptions } from "next/dist/server/next";
import http from "http";
import { DocumentNode } from "graphql/language/ast";
export interface BootServerConfig {
    useFullQueryParams?: boolean;
    useDefaultHeaders?: boolean;
    useWebsitesAPIRedirects?: boolean;
    useControllerParams?: boolean;
    useWebsitesAPI?: boolean;
    enableDebug?: boolean;
    nextServerConfig?: NextServerOptions;
    onRequest?: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    additionalDataInControllerParams?: (gqlResponse: RingGqlApiClientResponse<DefaultHatSite>) => any | void;
    shouldMakeRequestToWebsiteAPIOnThisRequest?: (req: http.IncomingMessage, defaultPathCheckValue: boolean) => boolean | void;
    prepareCustomGraphQLQueryToWebsiteAPI?: (url: string, variantId: string, dataContentQueryAsString: string, defaultGraphqlQuery: DocumentNode) => DocumentNode | void;
}
export interface DefaultControllerParams {
    gqlResponse: RingGqlApiClientResponse<DefaultHatSite>;
    customData: any;
}
export interface HATParsedUrlQuery extends HATSimpleUrlQuery, NextParsedUrlQuery {
}
export interface HATSimpleUrlQuery {
    controllerParams: DefaultControllerParams;
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
export declare type SiteNode = {
    __typename: "SiteNode";
    id: Scalars["UUID"];
    slug: Scalars["String"];
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
