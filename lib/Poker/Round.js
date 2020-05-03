"use strict";
exports.__esModule = true;
var Card_1 = require("./Card");
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
        players.forEach(function (player, i) {
            _this.playerStates.push({
                player: player,
                hasFolded: false,
                holeCards: [_this.deck.pop(), _this.deck.pop()],
                isDealer: i === 0,
                amountBetThisRound: 0
            });
            if (params.useAntes) {
                player.decrementBalance(params.anteBet);
                _this.pot += params.anteBet;
            }
        });
        if (params.useBlinds) {
            this.playerStates[1].player.decrementBalance(params.smallBlindBet);
            this.playerStates[1].amountBetThisRound = params.smallBlindBet;
            this.currentBet = params.smallBlindBet;
            this.pot += params.smallBlindBet;
            this.playerStates[2].player.decrementBalance(params.bigBlindBet);
            this.playerStates[2].amountBetThisRound = params.bigBlindBet;
            this.currentBet = params.bigBlindBet;
            this.pot += params.bigBlindBet;
            this.didLastRaise = this.playerStates[2].player;
            this.currentIndex = 3;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        }
        else {
            this.didLastRaise = this.playerStates[0].player;
        }
    }
    Round.prototype.getPot = function () { return this.pot; };
    Round.prototype.getCommunityCards = function () {
        return this.communityCards;
    };
    Round.prototype.getStateFor = function (player) {
        for (var i = 0; i < this.playerStates.length; ++i) {
            if (this.playerStates[i].player === player)
                return this.playerStates[i];
        }
        return null;
    };
    Round.prototype.makeBet = function (player, bet, requestedRaiseAmount) {
        if (requestedRaiseAmount === void 0) { requestedRaiseAmount = 0; }
        if (this.isFinished)
            throw new Error("Round is over!");
        var currentPlayerState = this.playerStates[this.currentIndex];
        var currentPlayer = currentPlayerState.player;
        var callAmount = this.currentBet - currentPlayerState.amountBetThisRound;
        if (currentPlayer !== player)
            throw new Error("This is not the current player!");
        switch (bet) {
            case Bet.Call:
                if (callAmount > currentPlayer.getBalance())
                    throw new Error("FIXME: need to make another pot");
                currentPlayer.decrementBalance(callAmount);
                currentPlayerState.amountBetThisRound += callAmount;
                this.pot += callAmount;
                break;
            case Bet.Raise:
                var raiseAmount = requestedRaiseAmount -
                    callAmount;
                if (raiseAmount <= 0)
                    throw new Error("You must raise by more than " + callAmount + "!");
                if (!currentPlayer.canAfford(raiseAmount))
                    throw new Error("You can only raise by (at most) " + (currentPlayer.getBalance() - callAmount) + "!");
                debug(this.currentIndex, "callAmount", callAmount, "requestedRaiseAmount", requestedRaiseAmount, "raiseAmount", raiseAmount);
                debug(" => amountBetThisRound", currentPlayerState.amountBetThisRound, "currentBet", this.currentBet, "pot", this.pot);
                currentPlayer.decrementBalance(requestedRaiseAmount);
                currentPlayerState.amountBetThisRound += requestedRaiseAmount;
                this.currentBet += raiseAmount;
                this.pot += requestedRaiseAmount;
                this.didLastRaise = currentPlayer;
                debug(" => amountBetThisRound", currentPlayerState.amountBetThisRound, "currentBet", this.currentBet, "pot", this.pot);
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
                throw new Error("Not implemented: choosing a winner");
            }
        }
    };
    Round.prototype.doFinish = function (winners) {
        if (winners.length !== 1)
            throw new Error("Not implemented: multiple winners");
        winners[0].incrementBalance(this.pot);
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