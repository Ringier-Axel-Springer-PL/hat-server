import { SiteResponse } from "../types";
export declare class RingDataLayer {
    encode(ringDataLayer: any): string;
    getRingDataLayer(path: any, gqlResponse: SiteResponse): RingDataLayer;
}
