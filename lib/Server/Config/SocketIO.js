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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var socket_io_1 = __importDefault(require("socket.io"));
var RoomService_1 = require("../Services/RoomService");
var Session_1 = require("./Session");
function onQueryRooms(io, socket, data) {
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
function onJoinRoom(io, socket, data) {
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
                        io.to("lobby").emit("update-room", updateRoomData);
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
function onCreateRoom(io, socket, data) {
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
                        io.to("lobby").emit("new-room", newRoomData);
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
function onSit(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var res, userId, roomId, secret, seatIndex, room, e_3;
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
                    res = { error: null, view: room.viewFor(userId) };
                    return [3, 4];
                case 3:
                    e_3 = _a.sent();
                    res = { error: e_3.message, view: null };
                    return [3, 4];
                case 4:
                    socket.emit("room-changed", res);
                    return [2];
            }
        });
    });
}
function onStand(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onStand", data);
            return [2];
        });
    });
}
function onLeave(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onLeave", data);
            return [2];
        });
    });
}
function onStart(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onStart", data);
            return [2];
        });
    });
}
function onAddBalance(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        var res, userId, roomId, secret, credit, room, e_4;
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
                    res = { error: null, view: room.viewFor(userId) };
                    return [3, 4];
                case 3:
                    e_4 = _a.sent();
                    res = { error: e_4.message, view: null };
                    return [3, 4];
                case 4:
                    socket.emit("room-changed", res);
                    return [2];
            }
        });
    });
}
function onFold(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onFold", data);
            return [2];
        });
    });
}
function onCall(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onCall", data);
            return [2];
        });
    });
}
function onRaise(io, socket, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("onRaise", data);
            return [2];
        });
    });
}
function onMessage(io, socket, data) {
    console.log("onMessage", data);
}
function configureSocketIO(server) {
    var _this = this;
    var io = socket_io_1["default"](server);
    io.use(function (socket, next) {
        Session_1.sessionMiddleware(socket.request, {}, next);
    });
    io.on("connection", function (socket) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, channel;
        var _this = this;
        return __generator(this, function (_a) {
            console.log("socket", socket.id, "connected with query", socket.handshake.query);
            if (!socket.request.session.passport ||
                !socket.request.session.passport.user) {
                console.log("WARNING: disconnecting unauthenticated socket", socket.id);
                return [2, socket.disconnect(true)];
            }
            roomId = socket.handshake.query.roomId;
            secret = socket.request.session.secret;
            channel = roomId ? ("room-" + roomId) : "lobby";
            socket.request.session.channel = channel;
            socket.request.session.save();
            socket.join(channel);
            console.log("socket", socket.id, "joined channel", channel);
            socket.on("message", function (data) { onMessage(io, socket, data); });
            socket.on("query-rooms", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onQueryRooms(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("join-room", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onJoinRoom(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("create-room", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onCreateRoom(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("sit", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onSit(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("stand", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onStand(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("leave", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onLeave(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("start", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onStart(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("add-balance", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onAddBalance(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("fold", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onFold(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("call", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onCall(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("raise", function (data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, onRaise(io, socket, data)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            }); }); });
            socket.on("disconnect", function () { console.log("socket", socket.id, "disconnected"); });
            return [2];
        });
    }); });
}
exports.configureSocketIO = configureSocketIO;
//# sourceMappingURL=SocketIO.js.map