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
var socket_io_1 = __importDefault(require("socket.io"));
var RoomService_1 = require("../Services/RoomService");
var Session_1 = require("./Session");
function onQueryRooms(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var rooms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, RoomService_1.summarize()];
                case 1:
                    rooms = _a.sent();
                    socket.emit("query-rooms", { rooms: rooms });
                    return [2];
            }
        });
    });
}
function onJoinRoom(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onJoinRoom", data);
            return [2];
        });
    });
}
function onCreateRoom(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onCreateRoom", data);
            return [2];
        });
    });
}
function onMessage(socket, data, userId, roomId) {
    console.log("onMessage", data);
}
function configureSocketIO(server) {
    var _this = this;
    var io = socket_io_1["default"](server);
    io.use(function (socket, next) {
        Session_1.sessionMiddleware(socket.request, {}, next);
    });
    io.on("connection", function (socket) {
        var session = socket.request.session;
        if (session.connections == null)
            session.connections = 0;
        session.connections++;
        session.save();
        console.log("new connection from", socket.id);
        if (!session.passport || !session.passport.user) {
            console.log("WARNING: disconnecting unauthenticated client");
            return socket.disconnect(true);
        }
        var userId = session.passport.user;
        var roomId = session.roomId;
        var secret = session.secret;
        socket.on("message", function (data) { onMessage(socket, data, userId, roomId); });
        socket.on("query-rooms", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, onQueryRooms(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("join-room", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, onJoinRoom(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("create-room", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, onCreateRoom(socket, data)];
                case 1:
                    _a.sent();
                    return [2];
            }
        }); }); });
        socket.on("disconnect", function () {
            console.log("disconnection from", socket.id);
        });
    });
}
exports.configureSocketIO = configureSocketIO;
//# sourceMappingURL=SocketIO.js.map