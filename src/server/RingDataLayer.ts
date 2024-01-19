import { Site } from "@ringpublishing/graphql-api-client/lib/types/websites-api";
import {SiteData, SiteNode, SiteResponse} from "../types";

export class RingDataLayer {
    public encode(ringDataLayer): string {
        return Buffer.from(JSON.stringify(ringDataLayer)).toString('base64');
    }

    public getRingDataLayer(path, gqlResponse: SiteResponse): RingDataLayer {
        const rdl: any = {
            context: {},
            content: {
                object: {},
                source: {},
                publication: {
                    point: {}
                },
            },
            user: {},
            ads: {}
        };


        const id = gqlResponse?.data?.site?.data?.content?.id;
        if (id) {
            rdl.content.object.id = id;
        }

        const type = gqlResponse?.data?.site?.data?.content?.__typename;
        if (type) {
            rdl.content.object.type = path === '/' ? 'Homepage' : type;
        }

        if (type === 'Story') {
            rdl.content.source.system = 'ring_content_space';
        }

        // @ts-ignore
        const pubId = gqlResponse?.data?.site?.data?.content?.mainPublicationPoint?.id;
        if (pubId) {
            rdl.content.publication.point.id = pubId;
        }

        // @ts-ignore
        const kind = gqlResponse?.data?.site?.data?.content?.kind?.code;
        if (kind) {
            rdl.content.object.kind = kind;
        }

        return rdl;
    }


}
