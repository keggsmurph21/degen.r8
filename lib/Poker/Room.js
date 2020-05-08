"use strict";
exports.__esModule = true;
var Utils_1 = require("../Utils");
var Round_1 = require("./Round");
exports.MIN_CAPACITY = 2;
exports.MAX_CAPACITY = 16;
var Room = (function () {
    function Room(getDeck, params) {
        this.sitting = [];
        this.standing = new Set();
        this.round = null;
        if (params.capacity !== Math.round(params.capacity))
            throw new Error("Capacity must be an integer (got " + params.capacity + ")");
        if (params.capacity !==
            Utils_1.clamp(exports.MIN_CAPACITY, params.capacity, exports.MAX_CAPACITY))
            throw new Error("Capacity outside valid range ([" + exports.MIN_CAPACITY + ", " + exports.MAX_CAPACITY + "], got " + params.capacity + ")");
        this.params = params;
        this.getDeck = getDeck;
        for (var i = 0; i < params.capacity; ++i)
            this.sitting.push(null);
    }
    Room.prototype.isSitting = function (player) {
        return this.sitting.indexOf(player) !== -1;
    };
    Room.prototype.isStanding = function (player) {
        return this.standing.has(player);
    };
    Room.prototype.sit = function (player, position) {
        if (!this.isStanding(player))
            throw new Error("This player is not standing!");
        if (this.sitting[position] === undefined)
            throw new Error("This is not a valid position!");
        if (this.sitting[position] !== null)
            throw new Error("There is already somewhere sitting here!");
        this.standing["delete"](player);
        this.sitting[position] = player;
    };
    Room.prototype.stand = function (player) {
        if (!this.isSitting(player))
            throw new Error("This player is not sitting!");
        this.sitting = this.sitting.map(function (sittingPlayer) { return (sittingPlayer === player) ? null : sittingPlayer; });
        this.standing.add(player);
    };
    Room.prototype.enter = function (player) {
        if (this.isSitting(player))
            throw new Error("This player is already sitting!");
        if (this.isStanding(player))
            throw new Error("This player is already standing!");
        this.standing.add(player);
    };
    Room.prototype.leave = function (player) {
        if (this.isSitting(player)) {
            this.sitting = this.sitting.map(function (sittingPlayer) {
                return (sittingPlayer === player) ? null : sittingPlayer;
            });
        }
        else if (this.isStanding(player)) {
            this.standing["delete"](player);
        }
        else {
            throw new Error("This player is not in the Room!");
        }
    };
    Room.prototype.startRound = function () {
        var eligiblePlayers = this.sitting.filter(function (player) { return player !== null && player.balance > 0; });
        if (eligiblePlayers.length === 0)
            throw new Error("There are no eligible players to start a Round with!");
        if (eligiblePlayers.length < 2)
            throw new Error("You cannot start a Round with only 1 eligible player!");
        this.round = new Round_1.Round(this.getDeck(), eligiblePlayers, this.params);
        return this.round;
    };
    Room.prototype.updateParams = function (params) { this.params = params; };
    Room.prototype.getSitting = function () { return this.sitting; };
    Room.prototype.getStanding = function () { return this.standing; };
    Room.prototype.getRound = function () { return this.round; };
    Room.prototype.getParams = function () { return this.params; };
    return Room;
}());
exports.Room = Room;
;
//# sourceMappingURL=Room.js.map