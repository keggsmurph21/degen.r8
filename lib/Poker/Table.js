"use strict";
exports.__esModule = true;
var Errors_1 = require("./Errors");
exports.MIN_SIZE = 2;
exports.MAX_SIZE = 16;
var Table = (function () {
    function Table(size) {
        this.size = size;
        this.byPosition = {};
        this.players = new Set();
        if (size < exports.MIN_SIZE)
            throw new Errors_1.InvalidStateError("Must have " + exports.MIN_SIZE + " or more players (got " + size + ")!");
        if (size > exports.MAX_SIZE)
            throw new Errors_1.InvalidStateError("Must have " + exports.MAX_SIZE + " or fewer players (got " + size + ")!");
        for (var i = 0; i < size; ++i)
            this.byPosition[i] = null;
    }
    Table.prototype.isValidIndex = function (index) {
        return 0 <= index && index < this.size;
    };
    Table.prototype.isFull = function () {
        for (var _i = 0, _a = Object.entries(this.byPosition); _i < _a.length; _i++) {
            var _b = _a[_i], _ = _b[0], player = _b[1];
            if (player == null)
                return false;
        }
        return true;
    };
    Table.prototype.addPlayer = function (playerToAdd, position) {
        if (!this.isValidIndex(position))
            throw new Errors_1.InvalidStateError("Index " + position + " out of range (size = " + this.size + ")!");
        if (this.players.has(playerToAdd))
            throw new Errors_1.InvalidStateError("This player is already at the Table!");
        if (this.byPosition[position] !== null)
            throw new Errors_1.InvalidStateError("There is already a player at position " + position + "!");
        this.byPosition[position] = playerToAdd;
        this.players.add(playerToAdd);
    };
    Table.prototype.removePlayer = function (playerToRemove) {
        if (!this.players.has(playerToRemove))
            throw new Errors_1.InvalidStateError("This player is not at the Table!");
        for (var _i = 0, _a = Object.entries(this.byPosition); _i < _a.length; _i++) {
            var _b = _a[_i], position = _b[0], playerAtTable = _b[1];
            if (playerAtTable !== playerToRemove)
                continue;
            this.players["delete"](playerToRemove);
            this.byPosition[position] = null;
            return;
        }
        throw new Errors_1.InvalidStateError("Never found player while trying to remove :/");
    };
    return Table;
}());
exports.Table = Table;
;
//# sourceMappingURL=Table.js.map