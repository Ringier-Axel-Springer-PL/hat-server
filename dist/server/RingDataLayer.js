"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingDataLayer = void 0;
class RingDataLayer {
    encode(ringDataLayer) {
        return Buffer.from(JSON.stringify(ringDataLayer)).toString('base64');
    }
    getRingDataLayer(path, gqlResponse) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const rdl = {
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
        const id = (_d = (_c = (_b = (_a = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _a === void 0 ? void 0 : _a.site) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.id;
        if (id) {
            rdl.content.object.id = id;
        }
        const type = (_h = (_g = (_f = (_e = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _e === void 0 ? void 0 : _e.site) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.__typename;
        if (type) {
            rdl.content.object.type = path === '/' ? 'Homepage' : type;
        }
        if (type === 'Story') {
            rdl.content.source.system = 'ring_content_space';
        }
        const pubId = (_o = (_m = (_l = (_k = (_j = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _j === void 0 ? void 0 : _j.site) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.mainPublicationPoint) === null || _o === void 0 ? void 0 : _o.id;
        if (pubId) {
            rdl.content.publication.point.id = pubId;
        }
        const kind = (_t = (_s = (_r = (_q = (_p = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _p === void 0 ? void 0 : _p.site) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.content) === null || _s === void 0 ? void 0 : _s.kind) === null || _t === void 0 ? void 0 : _t.code;
        if (kind) {
            rdl.content.object.kind = kind;
        }
        return rdl;
    }
}
exports.RingDataLayer = RingDataLayer;
//# sourceMappingURL=RingDataLayer.js.map