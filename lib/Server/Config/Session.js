"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_session_1 = __importDefault(require("express-session"));
exports.sessionMiddleware = express_session_1["default"]({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
});
//# sourceMappingURL=Session.js.map