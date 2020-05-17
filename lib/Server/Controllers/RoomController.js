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
var Defaults_1 = require("Poker/Defaults");
var RoomService_1 = require("../Services/RoomService");
exports.getLobby = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, availableRooms, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.summarize()];
            case 2:
                availableRooms = _a.sent();
                res.render("lobby", {
                    user: { id: user.id, name: user.name },
                    availableRooms: availableRooms,
                    params: {
                        ADD_BALANCE: Defaults_1.ADD_BALANCE,
                        ANTE_BET: Defaults_1.ANTE_BET,
                        AUTOPLAY_INTERVAL: Defaults_1.AUTOPLAY_INTERVAL,
                        BIG_BLIND_BET: Defaults_1.BIG_BLIND_BET,
                        CAPACITY: Defaults_1.CAPACITY,
                        MINIMUM_BET: Defaults_1.MINIMUM_BET,
                        SMALL_BLIND_BET: Defaults_1.SMALL_BLIND_BET,
                        USE_ANTES: Defaults_1.USE_ANTES,
                        USE_BLINDS: Defaults_1.USE_BLINDS
                    }
                });
                return [3, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                req.flash("error", e_1.message);
                res.redirect("/register.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.getRoom = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, room, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.find(user, roomId, secret)];
            case 2:
                room = _a.sent();
                res.render("room", {
                    user: { id: user.id, name: user.name },
                    roomId: roomId,
                    secret: secret,
                    capacity: room.getParams().capacity
                });
                return [3, 4];
            case 3:
                e_2 = _a.sent();
                console.log(e_2);
                req.flash("error", e_2.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postCreate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, secret, params, _a, roomId, room, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                secret = req.session.secret;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                params = RoomService_1.validateRoomParameters({
                    minimumBet: req.body.minimumBet,
                    useBlinds: req.body.useBlinds,
                    bigBlindBet: req.body.bigBlindBet,
                    smallBlindBet: req.body.smallBlindBet,
                    useAntes: req.body.useAntes,
                    anteBet: req.body.anteBet,
                    capacity: req.body.capacity,
                    autoplayInterval: req.body.autoplayInterval
                });
                return [4, RoomService_1.create(user, secret, params)];
            case 2:
                _a = __read.apply(void 0, [_b.sent(), 2]), roomId = _a[0], room = _a[1];
                req.session.roomId = roomId;
                req.session.secret = secret;
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_3 = _b.sent();
                console.log(e_3);
                req.flash("error", e_3.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postEnter = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.enter(user, roomId, secret)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_4 = _a.sent();
                console.log(e_4);
                req.flash("error", e_4.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postLeave = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.leave(user, roomId, secret)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_5 = _a.sent();
                console.log(e_5);
                req.flash("error", e_5.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postSit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, seatIndex, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                seatIndex = parseInt(req.body.seatIndex);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.sit(user, roomId, secret, seatIndex)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_6 = _a.sent();
                console.log(e_6);
                req.flash("error", e_6.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postStand = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.stand(user, roomId, secret)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_7 = _a.sent();
                console.log(e_7);
                req.flash("error", e_7.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postStartRound = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.startRound(user, roomId, secret)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_8 = _a.sent();
                console.log(e_8);
                req.flash("error", e_8.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postBet = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, betType, raiseBy, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                betType = RoomService_1.validateBetType(req.body.betType);
                raiseBy = parseFloat(req.body.raiseBy);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.makeBet(user, roomId, secret, betType, raiseBy)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_9 = _a.sent();
                console.log(e_9);
                req.flash("error", e_9.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.postAddBalance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, roomId, secret, credit, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                roomId = req.session.roomId;
                secret = req.session.secret;
                credit = parseFloat(req.body.credit);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, RoomService_1.addBalance(user, roomId, secret, credit)];
            case 2:
                _a.sent();
                res.redirect("/room.do");
                return [3, 4];
            case 3:
                e_10 = _a.sent();
                console.log(e_10);
                req.flash("error", e_10.message);
                res.redirect("/lobby.do");
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
//# sourceMappingURL=RoomController.js.map