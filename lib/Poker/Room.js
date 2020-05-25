"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
function getEligiblePlayerIds(playerIds, balanceLookup, permuteBy) {
    if (permuteBy === void 0) { permuteBy = 0; }
    return Utils_1.permute(playerIds, permuteBy)
        .filter(function (playerId) { return playerId !== null && balanceLookup[playerId] > 0; });
}
exports.getEligiblePlayerIds = getEligiblePlayerIds;
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
        return playerId !== null && this.participants !== null &&
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
    Room.prototype.canStartRound = function () {
        var eligiblePlayerIds = getEligiblePlayerIds(this.sitting, this.balances, this.dealerIndex);
        return (this.round === null || this.round.isFinished) &&
            eligiblePlayerIds.length >= 2;
    };
    Room.prototype.startRound = function () {
        var _this = this;
        if (!this.canStartRound())
            throw new Error("You cannot start a round right now!");
        var eligiblePlayerIds = getEligiblePlayerIds(this.sitting, this.balances, this.dealerIndex);
        var playersAndBalances = eligiblePlayerIds.map(function (playerId) {
            return {
                id: playerId,
                balance: _this.getBalance(playerId)
            };
        });
        this.round =
            Round_1.Round.create(this.getDeck(), playersAndBalances, this.params);
        this.participants = eligiblePlayerIds;
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
    Room.prototype.getBalance = function (playerId) {
        return this.balances[playerId];
    };
    Room.prototype.viewFor = function (playerId) {
        if (!this.isIn(playerId))
            return null;
        var round = null;
        if (this.round !== null) {
            round = {
                minimumBet: this.round.minimumBet,
                communityCards: this.round.communityCards,
                pots: this.round.pots,
                currentIndex: this.round.currentIndex,
                didLastRaiseIndex: this.round.didLastRaiseIndex,
                isFinished: this.round.isFinished,
                playerStates: this.round.playerStates.map(function (ps) {
                    var playerState = __assign({}, ps);
                    if (ps.playerId !== playerId) {
                        playerState.holeCards = null;
                    }
                    return playerState;
                })
            };
        }
        var v = {
            playerId: playerId,
            canStartRound: this.canStartRound(),
            params: this.params,
            sitting: this.sitting,
            standing: this.standing,
            participants: this.participants,
            isSitting: this.isSitting(playerId),
            isStanding: this.isStanding(playerId),
            isPlaying: this.isPlaying(playerId),
            balances: this.balances,
            round: round
        };
        console.log(JSON.stringify(v, null, 4));
        return v;
    };
    return Room;
}());
exports.Room = Room;
;
//# sourceMappingURL=Room.js.map