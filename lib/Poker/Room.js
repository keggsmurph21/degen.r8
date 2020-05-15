"use strict";
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
var Utils_1 = require("../Utils");
var Card_1 = require("./Card");
var Round_1 = require("./Round");
exports.MIN_CAPACITY = 2;
exports.MAX_CAPACITY = 16;
var Room = (function () {
    function Room() {
        this.sitting = [];
        this.standing = [];
        this.round = null;
        this.dealerIndex = 0;
    }
    Room.create = function (params, getDeck) {
        if (getDeck === void 0) { getDeck = Card_1.getShuffledDeck; }
        if (params.capacity !== Math.round(params.capacity))
            throw new Error("Capacity must be an integer (got " + params.capacity + ")");
        if (params.capacity !==
            Utils_1.clamp(exports.MIN_CAPACITY, params.capacity, exports.MAX_CAPACITY))
            throw new Error("Capacity outside valid range ([" + exports.MIN_CAPACITY + ", " + exports.MAX_CAPACITY + "], got " + params.capacity + ")");
        var room = new Room();
        room.params = params;
        room.getDeck = getDeck;
        for (var i = 0; i < params.capacity; ++i)
            room.sitting.push(null);
        return room;
    };
    Room.deserialize = function (serial, getDeck) {
        if (getDeck === void 0) { getDeck = Card_1.getShuffledDeck; }
        var room = new Room();
        room.getDeck = getDeck;
        room.sitting = serial.sitting.slice();
        room.standing = serial.standing.slice();
        room.round =
            serial.round === null ? null : Round_1.Round.deserialize(serial.round);
        room.params = {
            capacity: serial.capacity,
            autoplayInterval: serial.autoplayInterval,
            minimumBet: serial.minimumBet,
            useBlinds: serial.useBlinds,
            bigBlindBet: serial.bigBlindBet,
            smallBlindBet: serial.smallBlindBet,
            useAntes: serial.useAntes,
            anteBet: serial.anteBet
        };
        return room;
    };
    Room.prototype.serialize = function () {
        return {
            sitting: this.sitting.slice(),
            standing: this.standing.slice(),
            round: this.round ? this.round.serialize() : null,
            capacity: this.params.capacity,
            autoplayInterval: this.params.autoplayInterval,
            minimumBet: this.params.minimumBet,
            useBlinds: this.params.useBlinds,
            bigBlindBet: this.params.bigBlindBet,
            smallBlindBet: this.params.smallBlindBet,
            useAntes: this.params.useAntes,
            anteBet: this.params.anteBet
        };
    };
    Room.prototype.isSitting = function (player) {
        return this.sitting.reduce(function (isSitting, nextPlayer) {
            return isSitting || (nextPlayer && player.id === nextPlayer.id);
        }, false);
    };
    Room.prototype.isStanding = function (player) {
        return this.standing.reduce(function (isSitting, nextPlayer) {
            return isSitting || (nextPlayer && player.id === nextPlayer.id);
        }, false);
    };
    Room.prototype.sit = function (player, position) {
        if (!this.isStanding(player))
            throw new Error("This player is not standing!");
        if (this.sitting[position] === undefined)
            throw new Error("This is not a valid position!");
        if (this.sitting[position] !== null)
            throw new Error("There is already somewhere sitting here!");
        this.standing = this.standing.filter(function (standingPlayer) { return player.id !== standingPlayer.id; });
        this.sitting[position] = player;
    };
    Room.prototype.stand = function (player) {
        if (!this.isSitting(player))
            throw new Error("This player is not sitting!");
        this.sitting = this.sitting.map(function (sittingPlayer) { return (sittingPlayer && player.id === sittingPlayer.id)
            ? null
            : sittingPlayer; });
        this.standing.push(player);
    };
    Room.prototype.enter = function (player) {
        if (this.isSitting(player))
            throw new Error("This player is already sitting!");
        if (this.isStanding(player))
            throw new Error("This player is already standing!");
        this.standing.push(player);
    };
    Room.prototype.leave = function (player) {
        if (this.isSitting(player)) {
            this.sitting = this.sitting.map(function (sittingPlayer) {
                return (sittingPlayer && player.id === sittingPlayer.id)
                    ? null
                    : sittingPlayer;
            });
        }
        else if (this.isStanding(player)) {
            this.standing = this.standing.filter(function (standingPlayer) { return player.id !== standingPlayer.id; });
        }
        else {
            throw new Error("This player is not in the Room!");
        }
    };
    Room.prototype.startRound = function () {
        if (this.round !== null && !this.round.isFinished)
            throw new Error("There is already an ongoing round!");
        var eligiblePlayers = Utils_1.permute(this.sitting, this.dealerIndex)
            .filter(function (player) { return player !== null && player.balance > 0; });
        if (eligiblePlayers.length === 0)
            throw new Error("There are no eligible players to start a Round with!");
        if (eligiblePlayers.length === 1)
            throw new Error("You cannot start a Round with only 1 eligible player!");
        this.round = Round_1.Round.create(this.getDeck(), eligiblePlayers, this.params);
        return this.round;
    };
    Room.prototype.updateParams = function (params) { this.params = params; };
    Room.prototype.getSitting = function () { return this.sitting; };
    Room.prototype.getStanding = function () { return this.standing; };
    Room.prototype.getRound = function () { return this.round; };
    Room.prototype.getParams = function () { return this.params; };
    Room.prototype.viewFor = function (player) {
        if (!this.isSitting(player) && !this.isStanding(player))
            return null;
        var round = null;
        if (this.round !== null) {
            round = {
                myPlayerState: null,
                otherPlayerStates: [],
                minimumBet: this.round.minimumBet,
                communityCards: this.round.getCommunityCards(),
                pots: this.round.getPots(),
                currentIndex: this.round.getCurrentIndex(),
                didLastRaiseIndex: this.round.getDidLastRaiseIndex(),
                isFinished: this.round.isFinished
            };
            this.round.getPlayerStates().forEach(function (ps) {
                if (ps.playerId === player.id) {
                    round.myPlayerState = ps;
                    return;
                }
                var holeCards = ps.holeCards, otherPlayerState = __rest(ps, ["holeCards"]);
                round.otherPlayerStates.push(otherPlayerState);
            });
        }
        return {
            params: this.params,
            sitting: this.sitting,
            standing: this.standing,
            round: round
        };
    };
    return Room;
}());
exports.Room = Room;
;
//# sourceMappingURL=Room.js.map