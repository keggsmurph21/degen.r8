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
var Room_1 = require("../Models/Room");
var Room_2 = require("../Poker/Room");
var Round_1 = require("../Poker/Round");
exports.MIN_BET = 0.00;
exports.MAX_BET = 100.00;
exports.MIN_AUTOPLAY_INTERVAL = 0;
exports.MAX_AUTOPLAY_INTERVAL = 60;
function validateFloat(parameterName, rawValue, minValue, maxValue, decimalPrecision) {
    if (decimalPrecision === void 0) { decimalPrecision = 2; }
    var offset = Math.pow(10, decimalPrecision);
    var value = Math.round((parseFloat(rawValue) + Number.EPSILON) * offset) / offset;
    if (isNaN(value))
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is not a number");
    if (value < minValue || maxValue < value)
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is outside range " + minValue + " to " + maxValue);
    return value;
}
exports.validateFloat = validateFloat;
function validateInt(parameterName, rawValue, minValue, maxValue) {
    var value = parseInt(rawValue);
    if (isNaN(value))
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is not a number");
    if (value < minValue || maxValue < value)
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is outside range " + minValue + " to " + maxValue);
    return value;
}
exports.validateInt = validateInt;
function validateRoomParameters(params) {
    var useBlinds = params.useBlinds === "on" ? true : !!params.useBlinds;
    var useAntes = params.useAntes === "on" ? true : !!params.useAntes;
    return {
        minimumBet: validateFloat("minimumBet", params.minimumBet, exports.MIN_BET, exports.MAX_BET),
        useBlinds: useBlinds,
        bigBlindBet: params.useBlinds
            ? validateFloat("bigBlindBet", params.bigBlindBet, exports.MIN_BET, exports.MAX_BET)
            : null,
        smallBlindBet: params.useBlinds ? validateFloat("smallBlindBet", params.smallBlindBet, exports.MIN_BET, exports.MAX_BET)
            : null,
        useAntes: useAntes,
        anteBet: params.useAntes ? validateFloat("anteBet", params.anteBet, exports.MIN_BET, exports.MAX_BET)
            : null,
        capacity: validateInt("capacity", params.capacity, Room_2.MIN_CAPACITY, Room_2.MAX_CAPACITY),
        autoplayInterval: validateInt("autoplayInterval", params.autoplayInterval, exports.MIN_AUTOPLAY_INTERVAL, exports.MAX_AUTOPLAY_INTERVAL)
    };
}
exports.validateRoomParameters = validateRoomParameters;
function validateBetType(betString) {
    var betType = betString === "fold"
        ? Round_1.Bet.Fold
        : betString === "call"
            ? Round_1.Bet.Call
            : betString === "raise" ? Round_1.Bet.Raise : null;
    if (betType === null)
        throw new Error("invalid bet type: expected one of 'fold', 'call', 'raise', got '" + betString + "'");
    return betType;
}
exports.validateBetType = validateBetType;
function summarize() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.summarizeAllWithoutSecret()];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.summarize = summarize;
function find(user, roomId, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    if (!room.isIn(user.id))
                        throw new Error("Player is not in room!");
                    return [2, room];
            }
        });
    });
}
exports.find = find;
function create(user, secret, params) {
    return __awaiter(this, void 0, void 0, function () {
        var room, roomId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_2.Room.create(params)];
                case 1:
                    room = _a.sent();
                    return [4, Room_1.Room.create(room, secret)];
                case 2:
                    roomId = _a.sent();
                    room.enter(user.id);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 3:
                    _a.sent();
                    return [2, [roomId, room]];
            }
        });
    });
}
exports.create = create;
function enter(user, roomId, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    room.enter(user.id);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.enter = enter;
function leave(user, roomId, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    room.leave(user.id);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.leave = leave;
function sit(user, roomId, secret, seatIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    room.sit(user.id, seatIndex);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.sit = sit;
function stand(user, roomId, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    room.stand(user.id);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.stand = stand;
function startRound(user, roomId, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    if (!room.isSitting(user.id))
                        throw new Error("Cannot start round if not sitting!");
                    room.startRound();
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.startRound = startRound;
function makeBet(user, roomId, secret, betType, raiseBy) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    room.makeBet(user.id, betType, raiseBy);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.makeBet = makeBet;
function addBalance(user, roomId, secret, credit) {
    return __awaiter(this, void 0, void 0, function () {
        var room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        throw new Error("Room not found!");
                    room.addBalance(user.id, credit);
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.addBalance = addBalance;
//# sourceMappingURL=RoomService.js.map