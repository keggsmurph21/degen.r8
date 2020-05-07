"use strict";
exports.__esModule = true;
var Utils_1 = require("../Utils");
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
        .map(function (ps) {
        return {
            playerState: ps,
            bestHand: ps.hasFolded
                ? null
                : Hand_1.getBestFiveCardHand(communityCards.concat(ps.holeCards))
        };
    })
        .filter(function (_a) {
        var playerState = _a.playerState, bestHand = _a.bestHand;
        return bestHand !== null;
    });
}
function getWinners(playerStates, communityCards) {
    return Utils_1.sortIntoTiers(getScorableHands(playerStates, communityCards), function (a, b) { return Hand_1.compareHands(a.bestHand, b.bestHand); })
        .pop()
        .map(function (h) { return h.playerState; });
}
exports.getWinners = getWinners;
function commitToPot(pot, ps, balance) {
    if (balance === 0)
        return 0;
    var index = ps.index;
    var maxCommitment = pot.maxMarginalBet - pot.contributions[index];
    if (maxCommitment === 0)
        return 0;
    var marginalContrib = Math.min(maxCommitment, balance);
    var cumulativeContrib = pot.contributions[index] + marginalContrib;
    debug("maxCommitment", maxCommitment);
    debug("marginalBet", pot.marginalBet);
    debug("uncommitted", balance);
    debug("committing", marginalContrib);
    debug("alreadyCommitted", pot.contributions[index]);
    debug("commitment", cumulativeContrib);
    if (pot.marginalBet < cumulativeContrib)
        pot.marginalBet = cumulativeContrib;
    pot.contributions[index] += marginalContrib;
    return balance - marginalContrib;
}
var Round = (function () {
    function Round(deck, players, params) {
        var _this = this;
        this.playerStates = [];
        this.currentIndex = 0;
        this.communityCards = [];
        this.currentBet = 0;
        this.pots = [];
        this.anteBet = 0;
        this.isFinished = false;
        this.deck = deck;
        players.forEach(function (player, i) {
            _this.playerStates.push({
                index: i,
                player: player,
                hasFolded: false,
                holeCards: [_this.deck.pop(), _this.deck.pop()],
                amountBetThisRound: 0,
                maxStakes: player.balance
            });
        });
        this.pushPot();
        if (params.useAntes)
            this.playerStates.forEach(function (ps) { return _this.commitBet(ps, params.anteBet, false); });
        this.didLastRaise = this.playerStates[0].player;
        if (params.useBlinds) {
            this.commitBet(this.playerStates[1], params.smallBlindBet);
            this.commitBet(this.playerStates[2], params.bigBlindBet);
            this.currentIndex = 3;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        }
    }
    Round.prototype.getPot = function () {
        if (this.isFinished)
            return 0;
        return this.pots.reduce(function (potAcc, pot) {
            return potAcc + pot.contributions.reduce(function (contribAcc, contrib) { return contribAcc + contrib; }, 0);
        }, 0);
    };
    Round.prototype.getPots = function () { return this.pots; };
    Round.prototype.getCommunityCards = function () {
        return this.communityCards;
    };
    Round.prototype.getCurrentBet = function () {
        return this.pots.reduce(function (acc, pot) { return acc + pot.marginalBet; }, 0);
    };
    Round.prototype.getAmountAlreadyBet = function (ps) {
        return this.pots.reduce(function (acc, pot) { return acc + pot.contributions[ps.index]; }, 0);
    };
    Round.prototype.getStateFor = function (player) {
        for (var i = 0; i < this.playerStates.length; ++i) {
            if (this.playerStates[i].player === player)
                return this.playerStates[i];
        }
        return null;
    };
    Round.prototype.commitBet = function (ps, amountToCommit, affectsRoundTotals) {
        if (affectsRoundTotals === void 0) { affectsRoundTotals = true; }
        debug("commitBet", ps.index, amountToCommit, this.pots);
        if (this.getCurrentBet() <
            this.getAmountAlreadyBet(ps) + amountToCommit)
            this.didLastRaise = ps.player;
        var uncommittedAmount = Math.min(ps.player.balance, amountToCommit);
        ps.player.balance -= uncommittedAmount;
        uncommittedAmount =
            this.pots.filter(function (pot) { return pot.maxCumulativeBet <= ps.maxStakes; })
                .reduce(function (remaining, pot) { return commitToPot(pot, ps, remaining); }, uncommittedAmount);
        debug("after looping pots", this.pots);
        while (uncommittedAmount > 0) {
            debug("adding a new pot to handle", uncommittedAmount);
            var pot = this.pushPot();
            debug(this.pots);
            uncommittedAmount = commitToPot(pot, ps, uncommittedAmount);
            debug("after adding a new pot", this.pots);
        }
    };
    Round.prototype.pushPot = function () {
        var lastMaxCumulativeBet = this.pots.length > 0
            ? this.pots[this.pots.length - 1].maxCumulativeBet
            : 0;
        var pot = {
            maxCumulativeBet: this.playerStates.filter(function (ps) { return !ps.hasFolded; })
                .filter(function (ps) { return ps.maxStakes > lastMaxCumulativeBet; })
                .reduce(function (maxCumulativeBet, ps) {
                return Math.min(maxCumulativeBet, ps.maxStakes);
            }, Infinity),
            maxMarginalBet: this.playerStates.filter(function (ps) { return !ps.hasFolded; })
                .filter(function (ps) { return ps.maxStakes > lastMaxCumulativeBet; })
                .reduce(function (maxMarginalBet, ps) {
                return Math.min(maxMarginalBet, ps.maxStakes - lastMaxCumulativeBet);
            }, Infinity),
            marginalBet: 0,
            contributions: this.playerStates.map(function (_) { return 0; })
        };
        this.pots.push(pot);
        return pot;
    };
    Round.prototype.filterPots = function () {
        var _this = this;
        debug("pre-filter", this.pots);
        this.pots = this.pots.filter(function (pot) {
            var playersThatCanAfford = _this.playerStates.filter(function (ps) { return !ps.hasFolded; })
                .filter(function (ps) { return ps.maxStakes >= pot.maxCumulativeBet; });
            if (playersThatCanAfford.length > 1)
                return true;
            if (playersThatCanAfford.length === 0)
                throw new Error("This shouldn't happen!");
            var playerToRefund = playersThatCanAfford[0];
            playerToRefund.player.balance +=
                pot.contributions.reduce(function (acc, contrib) { return acc += contrib; }, 0);
            return false;
        });
        debug("post-filter", this.pots);
    };
    Round.prototype.makeBet = function (player, bet, raiseBy) {
        var _this = this;
        if (raiseBy === void 0) { raiseBy = 0; }
        if (this.isFinished)
            throw new Error("Round is over!");
        var currentPlayerState = this.playerStates[this.currentIndex];
        var currentPlayer = currentPlayerState.player;
        var callAmount = this.getCurrentBet() - this.getAmountAlreadyBet(currentPlayerState);
        if (currentPlayer !== player)
            throw new Error("This is not the current player!");
        switch (bet) {
            case Bet.Call:
                this.commitBet(currentPlayerState, callAmount);
                break;
            case Bet.Raise:
                if (raiseBy <= 0)
                    throw new Error("You must raise by a positive number!");
                if (currentPlayer.balance < callAmount + raiseBy)
                    throw new Error("You can not raise by more than your balance!");
                var highestPossibleBet = this.playerStates.filter(function (ps) { return !ps.hasFolded; })
                    .filter(function (ps) { return ps !== currentPlayerState; })
                    .map(function (ps) { return ps.player.balance + _this.getAmountAlreadyBet(ps); })
                    .reduce(function (a, b) { return Math.max(a, b); }, 0);
                if (callAmount + raiseBy > highestPossibleBet)
                    throw new Error("You cannot bet more than " + highestPossibleBet);
                this.commitBet(currentPlayerState, callAmount + raiseBy);
                break;
            case Bet.Fold:
                currentPlayerState.hasFolded = true;
                this.filterPots();
                var nonFoldedPlayers = this.playerStates.filter(function (ps) { return !ps.hasFolded; });
                if (nonFoldedPlayers.length == 1) {
                    this.doFinish();
                    return;
                }
                break;
        }
        do {
            ++this.currentIndex;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        } while (this.playerStates[this.currentIndex].hasFolded ||
            this.playerStates[this.currentIndex].player.balance === 0);
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
                this.doFinish();
            }
        }
    };
    Round.prototype.doFinish = function () {
        var _this = this;
        this.pots.forEach(function (pot) {
            var candidates = pot.contributions
                .map(function (contrib, index) {
                if (contrib === 0)
                    return null;
                return _this.playerStates[index];
            })
                .filter(function (ps) { return ps !== null; });
            var potBalance = pot.contributions.reduce(function (acc, contrib) { return acc += contrib; }, 0);
            getWinners(candidates, _this.communityCards)
                .forEach(function (ps, _, winners) {
                ps.player.balance += potBalance / winners.length;
            });
        });
        this.isFinished = true;
    };
    return Round;
}());
exports.Round = Round;
;
//# sourceMappingURL=Round.js.map