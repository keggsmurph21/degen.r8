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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var Utils_1 = require("../Utils");
var Defaults_1 = require("./Defaults");
var Hand_1 = require("./Hand");
var DEBUG = false;
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (DEBUG)
        console.log.apply(console, __spread(args));
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
exports.defaultRoundParameters = {
    minimumBet: Defaults_1.MINIMUM_BET.DEFAULT,
    useBlinds: Defaults_1.USE_BLINDS.DEFAULT,
    bigBlindBet: Defaults_1.BIG_BLIND_BET.DEFAULT,
    smallBlindBet: Defaults_1.SMALL_BLIND_BET.DEFAULT,
    useAntes: Defaults_1.USE_ANTES.DEFAULT,
    anteBet: Defaults_1.ANTE_BET.DEFAULT
};
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
    function Round() {
        this.playerStates = [];
        this.currentIndex = 0;
        this.communityCards = [];
        this.pots = [];
        this.didLastRaiseIndex = 0;
        this.isFinished = false;
    }
    Round.create = function (deck, players, params) {
        var round = new Round();
        round.deck = deck;
        round.minimumBet = params.minimumBet;
        players.forEach(function (player, i) {
            round.playerStates.push({
                index: i,
                playerId: player.id,
                hasFolded: false,
                holeCards: [round.deck.pop(), round.deck.pop()],
                balance: player.balance,
                maxStakes: player.balance
            });
        });
        round.pushPot();
        if (params.useAntes)
            round.playerStates.forEach(function (ps) { return round.commitBet(ps, params.anteBet, false); });
        if (params.useBlinds) {
            if (round.playerStates.length === 0)
                throw new Error("You cannot start a round with no players!");
            if (round.playerStates.length === 1)
                throw new Error("You cannot start a round with 1 player!");
            if (round.playerStates.length === 2) {
                round.commitBet(round.playerStates[0], params.smallBlindBet);
                round.commitBet(round.playerStates[1], params.bigBlindBet);
                round.currentIndex = 0;
            }
            else {
                round.commitBet(round.playerStates[1], params.smallBlindBet);
                round.commitBet(round.playerStates[2], params.bigBlindBet);
                round.currentIndex = round.playerStates.length === 3 ? 0 : 3;
            }
        }
        return round;
    };
    Round.deserialize = function (serial) {
        var round = new Round();
        round.playerStates = serial.playerStates.slice();
        round.minimumBet = serial.minimumBet;
        round.deck = serial.deck;
        round.currentIndex = serial.currentIndex;
        round.communityCards = serial.communityCards;
        round.pots = serial.pots.map(function (pot) {
            return __assign(__assign({}, pot), { contributions: pot.contributions.slice() });
        });
        round.didLastRaiseIndex = serial.didLastRaiseIndex;
        round.isFinished = serial.isFinished;
        return round;
    };
    Round.prototype.serialize = function () {
        return {
            playerStates: this.playerStates.slice(),
            minimumBet: this.minimumBet,
            deck: this.deck.slice(),
            currentIndex: this.currentIndex,
            communityCards: this.communityCards.slice(),
            pots: this.pots.map(function (pot) {
                return __assign(__assign({}, pot), { contributions: pot.contributions.slice() });
            }),
            didLastRaiseIndex: this.didLastRaiseIndex,
            isFinished: this.isFinished
        };
    };
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
    Round.prototype.getCurrentIndex = function () { return this.currentIndex; };
    Round.prototype.getDidLastRaiseIndex = function () { return this.didLastRaiseIndex; };
    Round.prototype.getPlayerStates = function () {
        return this.playerStates.slice();
    };
    Round.prototype.commitBet = function (ps, amountToCommit, affectsRoundTotals) {
        if (affectsRoundTotals === void 0) { affectsRoundTotals = true; }
        debug("commitBet", ps.index, amountToCommit, this.pots);
        if (this.getCurrentBet() <
            this.getAmountAlreadyBet(ps) + amountToCommit)
            this.didLastRaiseIndex = ps.index;
        var uncommittedAmount = Math.min(ps.balance, amountToCommit);
        ps.balance -= uncommittedAmount;
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
            playerToRefund.balance +=
                pot.contributions.reduce(function (acc, contrib) { return acc += contrib; }, 0);
            return false;
        });
        debug("post-filter", this.pots);
    };
    Round.prototype.makeBet = function (playerId, bet, raiseBy) {
        var _this = this;
        if (raiseBy === void 0) { raiseBy = 0; }
        if (this.isFinished)
            throw new Error("Round is over!");
        var currentPlayerState = this.playerStates[this.currentIndex];
        var callAmount = this.getCurrentBet() - this.getAmountAlreadyBet(currentPlayerState);
        if (playerId !== currentPlayerState.playerId)
            throw new Error("This is not the current player!");
        switch (bet) {
            case Bet.Call:
                this.commitBet(currentPlayerState, callAmount);
                break;
            case Bet.Raise:
                if (raiseBy < this.minimumBet)
                    throw new Error("You must raise by at least " + this.minimumBet + "!");
                if (currentPlayerState.balance < callAmount + raiseBy)
                    throw new Error("You can not raise by more than your balance!");
                var highestPossibleBet = this.playerStates.filter(function (ps) { return !ps.hasFolded; })
                    .filter(function (ps) { return ps !== currentPlayerState; })
                    .map(function (ps) { return ps.balance + _this.getAmountAlreadyBet(ps); })
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
            this.playerStates[this.currentIndex].balance === 0);
        if (this.didLastRaiseIndex === this.currentIndex) {
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
                ps.balance += potBalance / winners.length;
            });
        });
        this.isFinished = true;
    };
    Round.prototype.getBalance = function (playerId) {
        var playerState = Utils_1.findFirst(this.playerStates, function (ps) { return ps.playerId === playerId; });
        return playerState ? playerState.balance : null;
    };
    Round.prototype.addBalance = function (playerId, credit) {
        var playerState = Utils_1.findFirst(this.playerStates, function (ps) { return ps.playerId === playerId; });
        if (playerState !== null)
            playerState.balance += credit;
    };
    return Round;
}());
exports.Round = Round;
;
//# sourceMappingURL=Round.js.map