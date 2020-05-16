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
var Defaults_1 = require("./Defaults");
var Round_1 = require("./Round");
exports.defaultRoomParameters = {
    capacity: Defaults_1.CAPACITY.DEFAULT,
    autoplayInterval: Defaults_1.AUTOPLAY_INTERVAL.DEFAULT,
    minimumBet: Defaults_1.MINIMUM_BET.DEFAULT,
    useBlinds: Defaults_1.USE_BLINDS.DEFAULT,
    bigBlindBet: Defaults_1.BIG_BLIND_BET.DEFAULT,
    smallBlindBet: Defaults_1.SMALL_BLIND_BET.DEFAULT,
    useAntes: Defaults_1.USE_ANTES.DEFAULT,
    anteBet: Defaults_1.ANTE_BET.DEFAULT
};
var Room = (function () {
    function Room() {
        this.balances = {};
        this.sitting = [];
        this.standing = [];
        this.participants = null;
        this.round = null;
        this.dealerIndex = 0;
    }
    Room.create = function (params, getDeck) {
        if (getDeck === void 0) { getDeck = Card_1.getShuffledDeck; }
        if (params.capacity !== Math.round(params.capacity))
            throw new Error("Capacity must be an integer (got " + params.capacity + ")");
        if (params.capacity !==
            Utils_1.clamp(Defaults_1.CAPACITY.MIN, params.capacity, Defaults_1.CAPACITY.MAX))
            throw new Error("Capacity outside valid range ([" + Defaults_1.CAPACITY.MIN + ", " + Defaults_1.CAPACITY.MAX + "], got " + params.capacity + ")");
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
        room.sitting = serial.sitting;
        room.standing = serial.standing;
        room.dealerIndex = serial.dealerIndex;
        room.participants = serial.participants;
        room.balances = serial.balances;
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
            sitting: this.sitting,
            standing: this.standing,
            dealerIndex: this.dealerIndex,
            participants: this.participants,
            balances: this.balances,
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
    Room.prototype.isIn = function (playerId) {
        return this.isPlaying(playerId) || this.isSitting(playerId) ||
            this.isStanding(playerId);
    };
    Room.prototype.isPlaying = function (playerId) {
        return playerId !== null && this.participants &&
            this.participants.indexOf(playerId) !== -1;
    };
    Room.prototype.isSitting = function (playerId) {
        return playerId !== null && this.sitting.indexOf(playerId) !== -1;
    };
    Room.prototype.isStanding = function (playerId) {
        return playerId !== null && this.standing.indexOf(playerId) !== -1;
    };
    Room.prototype.sit = function (playerId, position) {
        if (!this.isStanding(playerId))
            throw new Error("This player is not standing!");
        if (this.sitting[position] === undefined)
            throw new Error("This is not a valid position!");
        if (this.sitting[position] !== null)
            throw new Error("There is already somewhere sitting here!");
        this.standing = this.standing.filter(function (standingPlayerId) {
            return playerId !== standingPlayerId;
        });
        this.sitting[position] = playerId;
    };
    Room.prototype.stand = function (playerId) {
        if (!this.isSitting(playerId))
            throw new Error("This player is not sitting!");
        this.sitting =
            this.sitting.map(function (sittingPlayerId) { return ((sittingPlayerId !== null) &&
                playerId === sittingPlayerId)
                ? null
                : sittingPlayerId; });
        this.standing.push(playerId);
    };
    Room.prototype.enter = function (playerId) {
        if (this.balances[playerId] === undefined)
            this.balances[playerId] = 0;
        if (this.isSitting(playerId))
            throw new Error("This player is already sitting!");
        if (this.isStanding(playerId))
            throw new Error("This player is already standing!");
        this.standing.push(playerId);
    };
    Room.prototype.leave = function (playerId) {
        if (this.isSitting(playerId)) {
            this.sitting = this.sitting.map(function (sittingPlayerId) {
                return ((sittingPlayerId !== null) && playerId === sittingPlayerId)
                    ? null
                    : sittingPlayerId;
            });
        }
        else if (this.isStanding(playerId)) {
            this.standing = this.standing.filter(function (standingPlayerId) { return playerId !== standingPlayerId; });
        }
        else {
            throw new Error("This player is not in the Room!");
        }
    };
    Room.prototype.startRound = function () {
        var _this = this;
        if (this.round !== null && !this.round.isFinished)
            throw new Error("There is already an ongoing round!");
        var eligiblePlayers = Utils_1.permute(this.sitting, this.dealerIndex)
            .filter(function (playerId) {
            return playerId !== null && _this.balances[playerId] > 0;
        });
        if (eligiblePlayers.length === 0)
            throw new Error("There are no eligible players to start a Round with!");
        if (eligiblePlayers.length === 1)
            throw new Error("You cannot start a Round with only 1 eligible player!");
        var playersAndBalances = eligiblePlayers.map(function (playerId) {
            return {
                id: playerId,
                balance: _this.getBalance(playerId)
            };
        });
        this.round =
            Round_1.Round.create(this.getDeck(), playersAndBalances, this.params);
        this.participants = eligiblePlayers;
        this.participants.forEach(function (playerId) {
            _this.balances[playerId] = _this.round.getBalance(playerId);
        });
        return this.round;
    };
    Room.prototype.makeBet = function (playerId, bet, raiseBy) {
        if (raiseBy === void 0) { raiseBy = 0; }
        if (this.round === null)
            throw new Error("There is no round!");
        if (!this.isPlaying(playerId))
            throw new Error("This player is not in the current round!");
        this.round.makeBet(playerId, bet, raiseBy);
        this.balances[playerId] = this.round.getBalance(playerId);
        if (!this.round.isFinished)
            return;
        this.round = null;
        this.participants = null;
        ++this.dealerIndex;
        if (this.dealerIndex === this.params.capacity)
            this.dealerIndex = 0;
    };
    Room.prototype.addBalance = function (playerId, credit) {
        if (!this.isIn(playerId))
            throw new Error("Cannot add balance because player is not at the table!");
        var minCredit = this.params.minimumBet;
        var maxCredit = 100 * this.params.bigBlindBet;
        if (credit !== Utils_1.clamp(minCredit, credit, maxCredit))
            throw new Error("Can't add balance outside valid range ([" + minCredit + ", " + maxCredit + "], got " + credit + ")");
        if (this.balances[playerId] == null)
            this.balances[playerId] = 0;
        this.balances[playerId] += credit;
        if (this.isPlaying(playerId))
            this.round.addBalance(playerId, credit);
    };
    Room.prototype.updateParams = function (params) { this.params = params; };
    Room.prototype.getSitting = function () { return this.sitting; };
    Room.prototype.getStanding = function () { return this.standing; };
    Room.prototype.getParticipants = function () {
        return this.participants;
    };
    Room.prototype.getDealerIndex = function () { return this.dealerIndex; };
    Room.prototype.getRound = function () { return this.round; };
    Room.prototype.getParams = function () { return this.params; };
    Room.prototype.getBalance = function (playerId) {
        return this.balances[playerId];
    };
    Room.prototype.viewFor = function (playerId) {
        if (!this.isIn(playerId))
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
                if (ps.playerId === playerId) {
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
            participants: this.participants,
            balances: this.balances,
            round: round
        };
    };
    return Room;
}());
exports.Room = Room;
;
//# sourceMappingURL=Room.js.map