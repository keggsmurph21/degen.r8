"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var express_flash_1 = __importDefault(require("express-flash"));
var express_session_1 = __importDefault(require("express-session"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var path_1 = __importDefault(require("path"));
var Passport_1 = require("./Config/Passport");
var Home_1 = require("./Controllers/Home");
var Room_1 = require("./Controllers/Room");
var User_1 = require("./Controllers/User");
exports.app = express_1["default"]();
exports.app.set("views", path_1["default"].join(__dirname, "Views"));
exports.app.set("view engine", "ejs");
exports.app.set("query parser", "simple");
exports.app.use(body_parser_1["default"].json());
exports.app.use(body_parser_1["default"].urlencoded({ extended: true }));
exports.app.use(express_session_1["default"]({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
exports.app.use(passport_1["default"].initialize());
exports.app.use(passport_1["default"].session());
exports.app.use(express_flash_1["default"]());
exports.app.use(express_1["default"].static(path_1["default"].join(__dirname, "../public")));
exports.app.use(morgan_1["default"]("dev"));
exports.app.get("/", Home_1.homeController.getHome);
exports.app.get("/login.do", User_1.userController.getLogin);
exports.app.get("/register.do", User_1.userController.getRegister);
exports.app.get("/lobby.do", Passport_1.isAuthenticated, Room_1.roomController.getLobby);
exports.app.get("/room.do", Passport_1.isAuthenticated, Room_1.roomController.getRoom);
exports.app.post("/login.rest", User_1.userController.postLogin);
exports.app.post("/logout.rest", Passport_1.isAuthenticated, User_1.userController.postLogout);
exports.app.post("/register.rest", User_1.userController.postRegister);
exports.app.post("/addBalance.rest", Passport_1.isAuthenticated, User_1.userController.postAddBalance);
exports.app.post("/room/create.rest", Passport_1.isAuthenticated, Room_1.roomController.postCreate);
exports.app.post("/room/:roomId/enter.rest", Passport_1.isAuthenticated, Room_1.roomController.postEnter);
exports.app.post("/room/:roomId/leave.rest", Passport_1.isAuthenticated, Room_1.roomController.postLeave);
exports.app.post("/room/:roomId/sit.rest", Passport_1.isAuthenticated, Room_1.roomController.postSit);
exports.app.post("/room/:roomId/stand.rest", Passport_1.isAuthenticated, Room_1.roomController.postStand);
exports.app.post("/room/:roomId/startRound.rest", Passport_1.isAuthenticated, Room_1.roomController.postStartRound);
exports.app.post("/room/:roomId/bet.rest", Passport_1.isAuthenticated, Room_1.roomController.postBet);
//# sourceMappingURL=App.js.map