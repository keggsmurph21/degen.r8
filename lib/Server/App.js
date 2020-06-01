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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var express_flash_1 = __importDefault(require("express-flash"));
var morgan_1 = __importDefault(require("morgan"));
var passport_1 = __importDefault(require("passport"));
var path_1 = __importDefault(require("path"));
var Passport_1 = require("./Config/Passport");
var Session_1 = require("./Config/Session");
var SocketIO_1 = require("./Config/SocketIO");
var RoomController_1 = require("./Controllers/RoomController");
var UserController_1 = require("./Controllers/UserController");
var UserService_1 = require("./Services/UserService");
var Lobby_1 = require("./SocketControllers/Lobby");
var Messaging_1 = require("./SocketControllers/Messaging");
var Room_1 = require("./SocketControllers/Room");
var app = express_1["default"]();
var PORT = process.env.PORT;
app.set("views", path_1["default"].join(__dirname, "Views"));
app.set("view engine", "ejs");
app.set("query parser", "simple");
app.use(body_parser_1["default"].json());
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.use(Session_1.sessionMiddleware);
app.use(passport_1["default"].initialize());
app.use(passport_1["default"].session());
app.use(express_flash_1["default"]());
app.use("/assets", express_1["default"].static(path_1["default"].join(__dirname, "../../public")));
app.use(morgan_1["default"]("dev"));
Passport_1.configurePassport();
app.get("/", function (req, res) { return res.redirect("/lobby.do"); });
app.get("/login.do", UserController_1.getLogin);
app.get("/register.do", UserController_1.getRegister);
app.get("/lobby.do", UserService_1.isAuthenticated, RoomController_1.getLobby);
app.get("/room.do", UserService_1.isAuthenticated, RoomController_1.getRoom);
app.post("/login.rest", UserService_1.authenticate);
app.post("/logout.rest", UserService_1.isAuthenticated, UserController_1.postLogout);
app.post("/register.rest", UserController_1.postRegister);
app.post("/room/create.rest", UserService_1.isAuthenticated, RoomController_1.postCreate);
app.post("/room/addBalance.rest", UserService_1.isAuthenticated, RoomController_1.postAddBalance);
app.post("/room/enter.rest", UserService_1.isAuthenticated, RoomController_1.postEnter);
app.post("/room/leave.rest", UserService_1.isAuthenticated, RoomController_1.postLeave);
app.post("/room/sit.rest", UserService_1.isAuthenticated, RoomController_1.postSit);
app.post("/room/stand.rest", UserService_1.isAuthenticated, RoomController_1.postStand);
app.post("/room/startRound.rest", UserService_1.isAuthenticated, RoomController_1.postStartRound);
app.post("/room/bet.rest", UserService_1.isAuthenticated, RoomController_1.postBet);
exports.serve = function () {
    var server = app.listen(PORT, function () { console.log("Listening at http://localhost:" + PORT); });
    SocketIO_1.configureSocketIO(server, function (socket) {
        socket.on("message", function (data) { Messaging_1.onMessage(socket, data); });
        socket.on("query-rooms", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Lobby_1.onQueryRooms(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("join-room", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Lobby_1.onJoinRoom(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("create-room", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Lobby_1.onCreateRoom(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("sit", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onSit(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("stand", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onStand(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("leave", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onLeave(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("start", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onStart(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("add-balance", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onAddBalance(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("fold", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onFold(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("call", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onCall(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("raise", function (data) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.onRaise(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
    });
};
//# sourceMappingURL=App.js.map