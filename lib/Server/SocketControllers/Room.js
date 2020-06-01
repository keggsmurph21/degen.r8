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
exports.__esModule = true;
var Round_1 = require("Poker/Round");
var SocketIO_1 = require("../Config/SocketIO");
var SocketIO_2 = require("../Config/SocketIO");
var RoomService_1 = require("../Services/RoomService");
function broadcastRoomView(roomId, room) {
    SocketIO_2.io["in"](SocketIO_1.channelNameFor(roomId)).clients(function (err, clients) {
        if (err)
            throw err;
        clients.forEach(function (socketId) {
            var socket = SocketIO_2.io.sockets.connected[socketId];
            var userId = socket.request.session.passport.user;
            var res = {
                error: null,
                view: room.viewFor(userId)
            };
            socket.emit("room-changed", res);
        });
    });
}
function onSit(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, seatIndex, room, e_1, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onSit", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    seatIndex = data.seatIndex;
                    return [4, RoomService_1.sit(userId, roomId, secret, seatIndex)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_1 = _a.sent();
                    res = { error: e_1.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onSit = onSit;
function onStand(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, room, e_2, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onStand", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    return [4, RoomService_1.stand(userId, roomId, secret)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_2 = _a.sent();
                    res = { error: e_2.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onStand = onStand;
function onLeave(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, room, e_3, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onLeave", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    return [4, RoomService_1.leave(userId, roomId, secret)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_3 = _a.sent();
                    res = { error: e_3.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onLeave = onLeave;
function onStart(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, room, e_4, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onStart", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    return [4, RoomService_1.startRound(userId, roomId, secret)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_4 = _a.sent();
                    res = { error: e_4.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onStart = onStart;
function onAddBalance(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, credit, room, e_5, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onAddBalance", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    credit = data.credit;
                    return [4, RoomService_1.addBalance(userId, roomId, secret, credit)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_5 = _a.sent();
                    res = { error: e_5.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onAddBalance = onAddBalance;
function onFold(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, room, e_6, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onFold", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    return [4, RoomService_1.makeBet(userId, roomId, secret, Round_1.Bet.Fold, 0)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_6 = _a.sent();
                    res = { error: e_6.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onFold = onFold;
function onCall(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, room, e_7, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onCall", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    return [4, RoomService_1.makeBet(userId, roomId, secret, Round_1.Bet.Call, 0)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_7 = _a.sent();
                    res = { error: e_7.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onCall = onCall;
function onRaise(socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, roomId, secret, raiseBy, room, e_8, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("onRaise", data);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    userId = socket.request.session.passport.user;
                    roomId = socket.request.session.roomId;
                    secret = socket.request.session.secret;
                    raiseBy = data.raiseBy;
                    return [4, RoomService_1.makeBet(userId, roomId, secret, Round_1.Bet.Raise, raiseBy)];
                case 2:
                    room = _a.sent();
                    broadcastRoomView(roomId, room);
                    return [3, 4];
                case 3:
                    e_8 = _a.sent();
                    res = { error: e_8.message, view: null };
                    socket.emit("room-changed", res);
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
exports.onRaise = onRaise;
//# sourceMappingURL=Room.js.map