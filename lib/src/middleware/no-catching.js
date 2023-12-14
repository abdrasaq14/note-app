"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCache = void 0;
function noCache(req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}
exports.noCache = noCache;
