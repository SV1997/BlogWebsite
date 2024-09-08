"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = require("express-session");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
class SessionStore extends express_session_1.Store {
    constructor() {
        super();
    }
    get(sid, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield prisma.session.findUnique({
                    where: { sid }
                });
                if (session) {
                    callback(null, JSON.parse(session.data));
                }
                else {
                    callback(null, null);
                }
            }
            catch (error) {
                callback(error);
            }
        });
    }
    set(sid, session, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                yield prisma.session.upsert({
                    where: { sid },
                    update: {
                        data: JSON.stringify(session),
                        expiresAt: new Date(Date.now() + ((_a = session.cookie.maxAge) !== null && _a !== void 0 ? _a : 0))
                    },
                    create: {
                        sid,
                        data: JSON.stringify(session),
                        expiresAt: new Date(Date.now() + ((_b = session.cookie.maxAge) !== null && _b !== void 0 ? _b : 0))
                    }
                });
                if (callback) {
                    callback(null);
                }
            }
            catch (error) {
                callback(error);
            }
        });
    }
    destroy(sid, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.session.delete({
                    where: { sid }
                });
                if (callback) {
                    callback(null);
                }
            }
            catch (error) {
                if (callback) {
                    callback(null);
                }
            }
        });
    }
    generate(req) {
        req.sessionID = (0, uuid_1.v4)();
        console.log(`Generated new session ID: ${req.sessionID}`);
    }
}
exports.default = SessionStore;
//# sourceMappingURL=session.js.map