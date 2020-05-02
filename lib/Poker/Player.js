"use strict";
exports.__esModule = true;
var Player = (function () {
    function Player() {
        this.balance = 20.00;
    }
    Player.prototype.incrementBalance = function (delta) {
        this.balance += delta;
    };
    Player.prototype.decrementBalance = function (delta) {
        this.balance -= delta;
        if (this.balance < 0)
            throw new Error("Negative balance!");
    };
    Player.prototype.getBalance = function () {
        return this.balance;
    };
    Player.prototype.canAfford = function (amount) {
        return this.balance >= amount;
    };
    return Player;
}());
exports.Player = Player;
;
//# sourceMappingURL=Player.js.map