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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var SocketIO_1 = require("../Config/SocketIO");
var RoomService_1 = require("../Services/RoomService");
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
exports.onQueryRooms = onQueryRooms;
function onJoinRoom(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var res, userId, roomId, secret, room, updateRoomData, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onJoin", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = data.roomId;
                    secret = data.secret;
                    return [4, RoomService_1.enter(userId, roomId, secret)];
                case 2:
                    room = _a.sent();
                    socket.request.session.roomId = roomId;
                    socket.request.session.secret = secret;
                    socket.request.session.save();
                    if (!secret) {
                        updateRoomData = {
                            id: roomId,
                            capacity: room.params.capacity,
                            numSitting: room.sitting.filter(function (p) { return p !== null; }).length,
                            numStanding: room.standing.filter(function (p) { return p !== null; }).length,
                            minimumBet: room.params.minimumBet
                        };
                        socket.to(SocketIO_1.channelNameFor(null)).emit("update-room", updateRoomData);
                    }
                    res = { error: null, roomId: roomId };
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    res = { error: e_1.message, roomId: null };
                    return [3, 4];
                case 4:
                    socket.emit("join-room", res);
                    return [2];
            }
        });
    });
}
exports.onJoinRoom = onJoinRoom;
function onCreateRoom(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var res, params, userId, secret, _a, roomId, room, newRoomData, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    params = RoomService_1.validateRoomParameters(data.params);
                    userId = socket.request.session.passport.user;
                    secret = data.params.secret;
                    return [4, RoomService_1.create(userId, secret, params)];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), roomId = _a[0], room = _a[1];
                    socket.request.session.roomId = roomId;
                    socket.request.session.secret = secret;
                    socket.request.session.save();
                    if (!secret) {
                        newRoomData = {
                            id: roomId,
                            capacity: room.params.capacity,
                            numSitting: room.sitting.filter(function (p) { return p !== null; }).length,
                            numStanding: room.standing.filter(function (p) { return p !== null; }).length,
                            minimumBet: room.params.minimumBet
                        };
                        socket.to(SocketIO_1.channelNameFor(null)).emit("new-room", newRoomData);
                    }
                    res = { error: null, roomId: roomId };
                    return [3, 3];
                case 2:
                    e_2 = _b.sent();
                    res = { error: e_2.message, roomId: null };
                    return [3, 3];
                case 3:
                    socket.emit("create-room", res);
                    return [2];
            }
        });
    });
}
exports.onCreateRoom = onCreateRoom;
//# sourceMappingURL=Lobby.js.map