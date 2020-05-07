"use strict";
exports.__esModule = true;
var Utils_1 = require("../Utils");
var Round_1 = require("./Round");
exports.MIN_CAPACITY = 2;
exports.MAX_CAPACITY = 16;
var Room = (function () {
    function Room(getDeck, params) {
        this.sitting = {};
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
            this.sitting[i] = null;
    }
    Room.prototype.sit = function (player) { };
    Room.prototype.stand = function (player) { };
    Room.prototype.enter = function (player) {
        if (Object.values(this.sitting)
            .filter(function (sittingPlayer) { return sittingPlayer !== null; })
            .reduce(function (alreadySitting, sittingPlayer) {
            return alreadySitting || (player === sittingPlayer);
        }, false)) {
            throw new Error("This player is already sitting!");
        }
        if (this.standing.has(player)) {
            throw new Error("This player is already standing!");
        }
        this.standing.add(player);
    };
    Room.prototype.leave = function (player) { };
    Room.prototype.startRound = function () {
        this.round = new Round_1.Round(this.getDeck(), Object.values(this.sitting)
            .filter(function (player) { return player !== null && player.balance > 0; }), this.params);
        return this.round;
    };
    Room.prototype.getSitting = function () { return this.sitting; };
    Room.prototype.getStanding = function () { return this.standing; };
    Room.prototype.getRound = function () { return this.round; };
    Room.prototype.getParams = function () { return this.params; };
    return Room;
}());
exports.Room = Room;
;
//# sourceMappingURL=Room.js.map