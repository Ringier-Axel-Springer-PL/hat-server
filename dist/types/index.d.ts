import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { RingGqlApiClientResponse } from "@ringpublishing/graphql-api-client";
export interface DefaultControllerParams {
    gqlResponse: RingGqlApiClientResponse<Site>;
    customData: any;
}
export interface HATParsedUrlQuery extends HATSimpleUrlQuery, NextParsedUrlQuery {
}
export interface HATSimpleUrlQuery {
    controllerParams: DefaultControllerParams;
    url: string;
}
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
