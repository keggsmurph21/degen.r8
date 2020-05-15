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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var Room_1 = require("../Models/Room");
var Room_2 = require("../Poker/Room");
var Round_1 = require("../Poker/Round");
var MIN_BET = 0.00;
var MAX_BET = 100.00;
var MIN_AUTOPLAY_INTERVAL = 0;
var MAX_AUTOPLAY_INTERVAL = 60;
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
function validateInt(parameterName, rawValue, minValue, maxValue) {
    var value = parseInt(rawValue);
    if (isNaN(value))
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is not a number");
    if (value < minValue || maxValue < value)
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is outside range " + minValue + " to " + maxValue);
    return value;
}
var roomController;
(function (roomController) {
    var _this = this;
    roomController.getLobby = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var availableRooms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Room_1.Room.summarizeAllWithoutSecret()];
                case 1:
                    availableRooms = _a.sent();
                    res.render("lobby", { isLoggedIn: true, availableRooms: availableRooms });
                    return [2];
            }
        });
    }); };
    roomController.getRoom = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, room, user, passwordHash, player;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.query.r);
                    secret = (req.query.s || "").toString() || null;
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    user = req.user;
                    passwordHash = user.passwordHash, player = __rest(user, ["passwordHash"]);
                    res.render("room", {
                        isLoggedIn: true,
                        roomId: roomId,
                        player: player,
                        secret: secret,
                        room: room.viewFor(player)
                    });
                    return [2];
            }
        });
    }); };
    roomController.postCreate = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var minimumBet, useBlinds, bigBlindBet, smallBlindBet, useAntes, anteBet, capacity, autoplayInterval, secret, pokerRoom, roomId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secret = req.body.secret || null;
                    try {
                        minimumBet =
                            validateFloat("minimumBet", req.body.minimumBet, MIN_BET, MAX_BET);
                        useBlinds = req.body.useBlinds === "on";
                        bigBlindBet = useBlinds
                            ? validateFloat("bigBlindBet", req.body.bigBlindBet, MIN_BET, MAX_BET)
                            : null;
                        smallBlindBet =
                            useBlinds ? validateFloat("smallBlindBet", req.body.smallBlindBet, MIN_BET, MAX_BET)
                                : null;
                        useAntes = req.body.useAntes === "on";
                        anteBet = useAntes ? validateFloat("anteBet", req.body.anteBet, MIN_BET, MAX_BET)
                            : null;
                        capacity = validateInt("capacity", req.body.capacity, Room_2.MIN_CAPACITY, Room_2.MAX_CAPACITY);
                        autoplayInterval =
                            validateInt("autoplayInterval", req.body.autoplayInterval, MIN_AUTOPLAY_INTERVAL, MAX_AUTOPLAY_INTERVAL);
                    }
                    catch (e) {
                        req.flash("errors", e.message);
                        return [2, res.redirect("/lobby.do")];
                    }
                    pokerRoom = Room_2.Room.create({
                        capacity: capacity,
                        autoplayInterval: autoplayInterval,
                        minimumBet: minimumBet,
                        useBlinds: useBlinds,
                        bigBlindBet: bigBlindBet,
                        smallBlindBet: smallBlindBet,
                        useAntes: useAntes,
                        anteBet: anteBet
                    });
                    pokerRoom.enter(req.user);
                    return [4, Room_1.Room.create(pokerRoom, secret)];
                case 1:
                    roomId = _a.sent();
                    res.redirect("/room.do?r=" + roomId + "&s=" + (secret || ""));
                    return [2];
            }
        });
    }); };
    roomController.postEnter = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, room, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.params.roomId);
                    secret = req.body.secret || null;
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    user = req.user;
                    try {
                        room.enter(req.user);
                    }
                    catch (e) {
                        console.log(e);
                        req.flash("errors", e.message);
                    }
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    res.redirect("/room.do?r=" + roomId + "&s=" + (secret || ""));
                    return [2];
            }
        });
    }); };
    roomController.postLeave = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.params.roomId);
                    secret = (req.body.secret || "").toString() || null;
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    try {
                        room.leave(req.user);
                        console.log(room);
                    }
                    catch (e) {
                        console.log(e);
                        req.flash("errors", e.message);
                    }
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    res.redirect("/lobby.do");
                    return [2];
            }
        });
    }); };
    roomController.postSit = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, seatIndex, room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.params.roomId);
                    secret = (req.body.secret || "").toString() || null;
                    seatIndex = parseInt(req.body.seatIndex);
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    try {
                        room.sit(req.user, seatIndex);
                    }
                    catch (e) {
                        console.log(e);
                        req.flash("errors", e.message);
                    }
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    res.redirect("/room.do?r=" + roomId + "&s=" + (secret || ""));
                    return [2];
            }
        });
    }); };
    roomController.postStand = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, room;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.params.roomId);
                    secret = (req.body.secret || "").toString() || null;
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    try {
                        room.stand(req.user);
                    }
                    catch (e) {
                        console.log(e);
                        req.flash("errors", e.message);
                    }
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    res.redirect("/room.do?r=" + roomId + "&s=" + (secret || ""));
                    return [2];
            }
        });
    }); };
    roomController.postStartRound = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, room, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.params.roomId);
                    secret = (req.body.secret || "").toString() || null;
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    user = req.user;
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    if (!room.getSitting().reduce(function (alreadyFound, sittingPlayer) {
                        return alreadyFound ||
                            (user.id === sittingPlayer.id);
                    }, false)) {
                        return [2, res.sendStatus(403)];
                    }
                    try {
                        room.startRound();
                    }
                    catch (e) {
                        console.log(e);
                        req.flash("errors", e.message);
                    }
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    res.redirect("/room.do?r=" + roomId + "&s=" + (secret || ""));
                    return [2];
            }
        });
    }); };
    roomController.postBet = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var roomId, secret, room, user, betType, raiseBy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roomId = parseInt(req.params.roomId);
                    secret = (req.body.secret || "").toString() || null;
                    return [4, Room_1.Room.byId(roomId, secret)];
                case 1:
                    room = _a.sent();
                    if (room === null)
                        return [2, res.sendStatus(404)];
                    user = req.user;
                    if (!room.getSitting().reduce(function (alreadyFound, sittingPlayer) {
                        return alreadyFound ||
                            (user.id === sittingPlayer.id);
                    }, false)) {
                        return [2, res.sendStatus(403)];
                    }
                    betType = req.body.betType === "fold"
                        ? Round_1.Bet.Fold
                        : req.body.betType === "call"
                            ? Round_1.Bet.Call
                            : req.body.betType === "raise" ? Round_1.Bet.Raise : null;
                    if (betType === null)
                        return [2, res.sendStatus(400)];
                    raiseBy = 0;
                    if (betType === Round_1.Bet.Raise) {
                        try {
                            raiseBy =
                                validateFloat("raiseBy", req.body.raiseBy, MIN_BET, MAX_BET);
                        }
                        catch (e) {
                            console.log(e);
                            return [2, res.sendStatus(400)];
                        }
                    }
                    try {
                        room.getRound().makeBet(user.id, betType, raiseBy);
                    }
                    catch (e) {
                        console.log(e);
                        return [2, res.sendStatus(400)];
                    }
                    return [4, Room_1.Room.save(roomId, room, secret)];
                case 2:
                    _a.sent();
                    res.redirect("/room.do?r=" + roomId + "&s=" + (secret || ""));
                    return [2];
            }
        });
    }); };
})(roomController = exports.roomController || (exports.roomController = {}));
//# sourceMappingURL=Room.js.map