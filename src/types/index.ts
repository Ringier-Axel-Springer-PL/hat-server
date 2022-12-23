import {NextParsedUrlQuery} from "next/dist/server/request-meta";
import {RingGqlApiClientResponse} from "@ringpublishing/graphql-api-client";

export interface DefaultControllerParams {
    gqlResponse: RingGqlApiClientResponse<Site>;
    customData: any;
}

// @ts-ignore
export interface HATParsedUrlQuery extends HATSimpleUrlQuery, NextParsedUrlQuery {}

export interface HATSimpleUrlQuery {
    controllerParams: DefaultControllerParams;
    url: string;
}

export type Site = {
    data: SiteData
    headers: Headers
    statusCode: number
}

export type SiteData = {
    content: SiteContent
}

export type SiteContent =
    | Author
    | CustomAction
    | SiteNode
    | Source
    | Story
    | Topic

export type Author = {
    __typename: "Author"
    id: Scalars["UUID"]
}

export type CustomAction = {
    __typename: "CustomAction"
    id: Scalars["UUID"],
    action: Scalars["String"]
}

export type SiteNode = {
    __typename: "SiteNode"
    id: Scalars["UUID"]
    slug: Scalars["String"]
}

export type Source = {
    __typename: "Source"
    id: Scalars["UUID"]
    name: Scalars["String"]
}

export type Story = {
    __typename: "Story"
    id: Scalars["UUID"]
    title: Scalars["String"]
}

export type Topic = {
    __typename: "Topic"
    id: Scalars["UUID"]
    name: Scalars["String"]
}

export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    BigInt: any
    ContentCursor: any
    DateTime: any
    Domain: any
    ImageURL: any
    JSONObject: any
    URL: any
    UUID: any
}
