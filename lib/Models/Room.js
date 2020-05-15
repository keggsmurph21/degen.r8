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
var Database_1 = require("../Config/Database");
var Room_1 = require("../Poker/Room");
var INSERT = "\n    INSERT INTO Room (secret, minimumBet, useBlinds, bigBlindBet, smallBlindBet, useAntes,\n                      anteBet, capacity, autoplayInterval, numSitting, numStanding,\n                      sittingJson, standingJson, roundJson)\n        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
var UPDATE = "\n    UPDATE Room\n        SET secret = (?),\n            minimumBet = (?),\n            useBlinds = (?),\n            bigBlindBet = (?),\n            smallBlindBet = (?),\n            useAntes = (?),\n            anteBet = (?),\n            capacity = (?),\n            autoplayInterval = (?),\n            numSitting = (?),\n            numStanding = (?),\n            dealerIndex = (?),\n            sittingJson = (?),\n            standingJson = (?),\n            participantsJson = (?),\n            roundJson = (?)\n        WHERE id = (?)";
var BY_ID = "\n    SELECT id, secret, minimumBet, useBlinds, bigBlindBet, smallBlindBet, useAntes,\n                      anteBet, capacity, autoplayInterval, numSitting, numStanding,\n                      dealerIndex, sittingJson, standingJson, participantsJson, roundJson\n        FROM Room\n        WHERE id = (?)";
var SUMMARIZE_ALL_WITHOUT_SECRET = "\n    SELECT id, numSitting, capacity, numStanding, minimumBet\n        FROM Room\n        WHERE secret IS NULL";
var Room;
(function (Room) {
    function byId(roomId, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var db, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Database_1.connect()];
                    case 1:
                        db = _a.sent();
                        return [4, db.get(BY_ID, roomId)];
                    case 2:
                        row = _a.sent();
                        if (row === undefined)
                            return [2, null];
                        if (row.secret !== null && row.secret !== secret)
                            return [2, null];
                        return [2, Room_1.Room.deserialize({
                                sitting: JSON.parse(row.sittingJson),
                                standing: JSON.parse(row.standingJson),
                                participants: JSON.parse(row.participantsJson),
                                round: JSON.parse(row.roundJson),
                                dealerIndex: row.dealerIndex,
                                capacity: row.capacity,
                                autoplayInterval: row.autoplayInterval,
                                minimumBet: row.minimumBet,
                                useBlinds: row.useBlinds,
                                bigBlindBet: row.bigBlindBet,
                                smallBlindBet: row.smallBlindBet,
                                useAntes: row.useAntes,
                                anteBet: row.anteBet
                            })];
                }
            });
        });
    }
    Room.byId = byId;
    function summarizeAllWithoutSecret() {
        return __awaiter(this, void 0, void 0, function () {
            var db, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Database_1.connect()];
                    case 1:
                        db = _a.sent();
                        return [4, db.all(SUMMARIZE_ALL_WITHOUT_SECRET)];
                    case 2:
                        rows = _a.sent();
                        return [2, rows];
                }
            });
        });
    }
    Room.summarizeAllWithoutSecret = summarizeAllWithoutSecret;
    function save(roomId, pokerRoom, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var serial, numSitting, sittingJson, numStanding, standingJson, participantsJson, roundJson, db, _a, lastID, changes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serial = pokerRoom.serialize();
                        numSitting = serial.sitting.filter(function (p) { return p !== null; }).length;
                        sittingJson = JSON.stringify(serial.sitting);
                        numStanding = serial.standing.filter(function (p) { return p !== null; }).length;
                        standingJson = JSON.stringify(serial.standing);
                        participantsJson = JSON.stringify(serial.participants);
                        roundJson = JSON.stringify(serial.round);
                        return [4, Database_1.connect()];
                    case 1:
                        db = _b.sent();
                        return [4, db.run(UPDATE, secret, serial.minimumBet, serial.useBlinds, serial.bigBlindBet, serial.smallBlindBet, serial.useAntes, serial.anteBet, serial.capacity, serial.autoplayInterval, numSitting, numStanding, serial.dealerIndex, sittingJson, standingJson, roundJson, participantsJson, roomId)];
                    case 2:
                        _a = _b.sent(), lastID = _a.lastID, changes = _a.changes;
                        return [2, lastID];
                }
            });
        });
    }
    Room.save = save;
    function create(pokerRoom, secret) {
        return __awaiter(this, void 0, void 0, function () {
            var serial, numSitting, sittingJson, numStanding, standingJson, participantsJson, roundJson, db, _a, lastID, changes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serial = pokerRoom.serialize();
                        numSitting = serial.sitting.filter(function (p) { return p !== null; }).length;
                        sittingJson = JSON.stringify(serial.sitting);
                        numStanding = serial.standing.filter(function (p) { return p !== null; }).length;
                        standingJson = JSON.stringify(serial.standing);
                        participantsJson = JSON.stringify(serial.participants);
                        roundJson = JSON.stringify(serial.round);
                        return [4, Database_1.connect()];
                    case 1:
                        db = _b.sent();
                        return [4, db.run(INSERT, secret, serial.minimumBet, serial.useBlinds, serial.bigBlindBet, serial.smallBlindBet, serial.useAntes, serial.anteBet, serial.capacity, serial.autoplayInterval, numSitting, numStanding, serial.dealerIndex, sittingJson, standingJson, participantsJson, roundJson)];
                    case 2:
                        _a = _b.sent(), lastID = _a.lastID, changes = _a.changes;
                        return [2, lastID];
                }
            });
        });
    }
    Room.create = create;
})(Room = exports.Room || (exports.Room = {}));
//# sourceMappingURL=Room.js.map