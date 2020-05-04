"use strict";
exports.__esModule = true;
var Utils_1 = require("../Utils");
var Card_1 = require("./Card");
var Hand_1 = require("./Hand");
var DEBUG = false;
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (DEBUG)
        console.log.apply(console, args);
}
var Bet;
(function (Bet) {
    Bet[Bet["Call"] = 0] = "Call";
    Bet[Bet["Raise"] = 1] = "Raise";
    Bet[Bet["Fold"] = 2] = "Fold";
})(Bet = exports.Bet || (exports.Bet = {}));
function getScorableHands(playerStates, communityCards) {
    return playerStates
        .map(function (playerState) {
        return {
            player: playerState.player,
            bestHand: playerState.hasFolded
                ? null
                : Hand_1.getBestFiveCardHand(communityCards.concat(playerState.holeCards))
        };
    })
        .filter(function (_a) {
        var player = _a.player, bestHand = _a.bestHand;
        return bestHand !== null;
    });
}
function getWinners(playerStates, communityCards) {
    return Utils_1.sortIntoTiers(getScorableHands(playerStates, communityCards), function (a, b) { return Hand_1.compareHands(a.bestHand, b.bestHand); })
        .pop()
        .map(function (h) { return h.player; });
}
exports.getWinners = getWinners;
var Round = (function () {
    function Round(players, params) {
        var _this = this;
        this.playerStates = [];
        this.deck = Card_1.getShuffledDeck();
        this.currentIndex = 0;
        this.communityCards = [];
        this.currentBet = 0;
        this.pot = 0;
        this.isFinished = false;
        players.forEach(function (player) {
            _this.playerStates.push({
                player: player,
                hasFolded: false,
                holeCards: [_this.deck.pop(), _this.deck.pop()],
                amountBetThisRound: 0
            });
            if (params.useAntes)
                _this.commitBet(_this.playerStates[_this.playerStates.length - 1], params.anteBet, false);
        });
        this.didLastRaise = this.playerStates[0].player;
        if (params.useBlinds) {
            this.commitBet(this.playerStates[1], params.smallBlindBet);
            this.commitBet(this.playerStates[2], params.bigBlindBet);
            this.currentIndex = 3;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        }
    }
    Round.prototype.getPot = function () { return this.pot; };
    Round.prototype.getCommunityCards = function () {
        return this.communityCards;
    };
    Round.prototype.getCurrentBet = function () { return this.currentBet; };
    Round.prototype.getStateFor = function (player) {
        for (var i = 0; i < this.playerStates.length; ++i) {
            if (this.playerStates[i].player === player)
                return this.playerStates[i];
        }
        return null;
    };
    Round.prototype.commitBet = function (playerState, amount, affectsRoundTotals) {
        if (affectsRoundTotals === void 0) { affectsRoundTotals = true; }
        if (playerState.player.balance < amount)
            throw new Error("FIXME: need to make another pot");
        playerState.player.balance -= amount;
        if (affectsRoundTotals) {
            playerState.amountBetThisRound += amount;
            if (this.currentBet < playerState.amountBetThisRound)
                this.didLastRaise = playerState.player;
        }
        this.currentBet = playerState.amountBetThisRound;
        this.pot += amount;
    };
    Round.prototype.makeBet = function (player, bet, raiseBy) {
        if (raiseBy === void 0) { raiseBy = 0; }
        if (this.isFinished)
            throw new Error("Round is over!");
        var currentPlayerState = this.playerStates[this.currentIndex];
        var currentPlayer = currentPlayerState.player;
        var callAmount = this.currentBet - currentPlayerState.amountBetThisRound;
        if (currentPlayer !== player)
            throw new Error("This is not the current player!");
        switch (bet) {
            case Bet.Call:
                this.commitBet(currentPlayerState, callAmount);
                break;
            case Bet.Raise:
                if (raiseBy <= 0)
                    throw new Error("You must raise by a positive number!");
                this.commitBet(currentPlayerState, callAmount + raiseBy);
                break;
            case Bet.Fold:
                currentPlayerState.hasFolded = true;
                var remaining = this.playerStates
                    .map(function (playerState) {
                    if (!playerState.hasFolded)
                        return playerState;
                })
                    .filter(function (ps) { return ps !== undefined; });
                if (remaining.length == 1) {
                    this.doFinish([remaining[0].player]);
                    return;
                }
                break;
        }
        do {
            ++this.currentIndex;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        } while (this.playerStates[this.currentIndex].hasFolded);
        if (this.didLastRaise === this.playerStates[this.currentIndex].player) {
            if (this.communityCards.length === 0) {
                this.communityCards.push(this.deck.pop());
                this.communityCards.push(this.deck.pop());
                this.communityCards.push(this.deck.pop());
            }
            else if (this.communityCards.length === 3) {
                this.communityCards.push(this.deck.pop());
            }
            else if (this.communityCards.length === 4) {
                this.communityCards.push(this.deck.pop());
            }
            else if (this.communityCards.length === 5) {
                this.doFinish(getWinners(this.playerStates, this.communityCards));
            }
        }
    };
    Round.prototype.doFinish = function (winners) {
        if (winners.length !== 1)
            throw new Error("Not implemented: multiple winners");
        winners[0].balance += this.pot;
        this.pot = 0;
        this.isFinished = true;
    };
    Round.prototype.dump = function () {
        console.log("--");
        if (this.isFinished) {
            console.log("(round is over)");
            return;
        }
        this.playerStates.forEach(function (playerState) { return console.log(playerState); });
        console.log("currentIndex:", this.currentIndex);
        console.log("communityCards:", this.communityCards);
        console.log("pot:", this.pot);
        console.log("currentBet:", this.currentBet);
    };
    return Round;
}());
exports.Round = Round;
;
//# sourceMappingURL=Round.js.map