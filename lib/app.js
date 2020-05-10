"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var morgan_1 = __importDefault(require("morgan"));
var path_1 = __importDefault(require("path"));
var Home_1 = require("./Controllers/Home");
var Room_1 = require("./Controllers/Room");
var User_1 = require("./Controllers/User");
exports.app = express_1["default"]();
exports.app.set("views", path_1["default"].join(__dirname, "Views"));
exports.app.set("view engine", "ejs");
exports.app.use(body_parser_1["default"].json());
exports.app.use(express_session_1["default"]({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
exports.app.use(express_1["default"].static(path_1["default"].join(__dirname, "../public")));
exports.app.use(morgan_1["default"]("dev"));
exports.app.get("/", Home_1.homeController.getHome);
exports.app.get("/about.do", Home_1.homeController.getAbout);
exports.app.get("/login.do", User_1.userController.getLogin);
exports.app.get("/rooms.do", Room_1.roomController.getRooms);
exports.app.get("/room.do", Room_1.roomController.getRoom);
exports.app.post("/login.rest", User_1.userController.postLogin);
exports.app.post("/logout.rest", User_1.userController.postLogout);
exports.app.post("/room/create.rest", Room_1.roomController.postCreate);
exports.app.post("/room/enter.rest", Room_1.roomController.postEnter);
exports.app.post("/room/leave.rest", Room_1.roomController.postLeave);
exports.app.post("/room/sit.rest", Room_1.roomController.postSit);
exports.app.post("/room/stand.rest", Room_1.roomController.postStand);
exports.app.post("/room/bet.rest", Room_1.roomController.postBet);
//# sourceMappingURL=app.js.map