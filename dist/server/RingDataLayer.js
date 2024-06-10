"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RingDataLayer = void 0;
class RingDataLayer {
    encode(ringDataLayer) {
        return Buffer.from(JSON.stringify(ringDataLayer)).toString('base64');
    }
    getRingDataLayer(path, gqlResponse) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        const rdl = {
            content: {
                object: {},
                part: 1,
                source: {
                    system: 'ring_content_space',
                    id: process.env.WEBSITE_API_NAMESPACE_ID
                }
            },
            context: {
                publication_structure: {
                    root: ''
                }
            },
        };
        const id = (_d = (_c = (_b = (_a = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _a === void 0 ? void 0 : _a.site) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.id;
        if (id) {
            rdl.content.object.id = id;
        }
        let type = (_h = (_g = (_f = (_e = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _e === void 0 ? void 0 : _e.site) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.content) === null || _h === void 0 ? void 0 : _h.__typename;
        if (type) {
            rdl.content.object.type = this.mapType(type) || 'unknown';
        }
        const pubId = ((_o = (_m = (_l = (_k = (_j = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _j === void 0 ? void 0 : _j.site) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.mainPublicationPoint) === null || _o === void 0 ? void 0 : _o.id) || ((_t = (_s = (_r = (_q = (_p = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _p === void 0 ? void 0 : _p.site) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.content) === null || _s === void 0 ? void 0 : _s.publicationPoint) === null || _t === void 0 ? void 0 : _t.id);
        if (pubId) {
            rdl.content.publication = { point: { id: pubId } };
        }
        const kind = (_y = (_x = (_w = (_v = (_u = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _u === void 0 ? void 0 : _u.site) === null || _v === void 0 ? void 0 : _v.data) === null || _w === void 0 ? void 0 : _w.content) === null || _x === void 0 ? void 0 : _x.kind) === null || _y === void 0 ? void 0 : _y.code;
        if (kind) {
            rdl.content.object.kind = kind;
        }
        const breadcrumbs = ((_2 = (_1 = (_0 = (_z = gqlResponse === null || gqlResponse === void 0 ? void 0 : gqlResponse.data) === null || _z === void 0 ? void 0 : _z.site) === null || _0 === void 0 ? void 0 : _0.data) === null || _1 === void 0 ? void 0 : _1.node) === null || _2 === void 0 ? void 0 : _2.breadcrumbs) || [];
        if (breadcrumbs.length > 0) {
            rdl.context.publication_structure.root = (breadcrumbs[0].slug || '').toUpperCase();
            if (breadcrumbs.length > 1) {
                rdl.context.publication_structure.path = breadcrumbs.filter((elem, index) => index > 0).map(elem => elem === null || elem === void 0 ? void 0 : elem.slug).join('/').replaceAll('-', '_').toUpperCase();
                if (type === 'Story' && kind) {
                    rdl.context.publication_structure.path += `/${kind.toUpperCase()}`;
                }
            }
        }
        return rdl;
    }
    mapType(type) {
        const map = {
            'Author': 'person',
            'CustomAction': 'wildcard',
            'SiteNode': 'list',
            'Source': 'contentsource',
            'Story': 'story',
            'Topic': 'topic',
        };
        return map[type];
    }
}
exports.RingDataLayer = RingDataLayer;
//# sourceMappingURL=RingDataLayer.js.map