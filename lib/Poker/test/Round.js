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
require("mocha");
var chai_1 = require("chai");
var Card_1 = require("../Card");
var Defaults_1 = require("../Defaults");
var Round_1 = require("../Round");
var STARTING_BALANCE = Defaults_1.ADD_BALANCE.DEFAULT;
describe("Round", function () {
    var getPlayers = function (num) {
        var players = [];
        for (var i = 0; i < num; ++i)
            players.push({ balance: STARTING_BALANCE, id: i, name: "player" + i });
        return players;
    };
    describe("make bets", function () {
        describe("blinds", function () {
            it("zero players", function () {
                chai_1.expect(function () { return Round_1.Round.create(Card_1.getShuffledDeck(), [], Round_1.defaultRoundParameters); })
                    .to["throw"]();
            });
            it("one player", function () {
                chai_1.expect(function () { return Round_1.Round.create(Card_1.getShuffledDeck(), getPlayers(1), Round_1.defaultRoundParameters); })
                    .to["throw"]();
            });
            it("two players", function () {
                var players = getPlayers(2);
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        ]
                    }]);
                chai_1.expect(round.getPot())
                    .to.equal(2 * Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet +
                    Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(0))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.smallBlindBet);
                chai_1.expect(round.getBalance(1))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.bigBlindBet);
            });
            it("three players", function () {
                var players = getPlayers(3);
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        ]
                    }]);
                chai_1.expect(round.getPot())
                    .to.equal(3 * Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet +
                    Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(0))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
                chai_1.expect(round.getBalance(1))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.smallBlindBet);
                chai_1.expect(round.getBalance(2))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.bigBlindBet);
            });
            it("four players", function () {
                var players = getPlayers(4);
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, Round_1.defaultRoundParameters.anteBet
                        ]
                    }]);
                chai_1.expect(round.getPot())
                    .to.equal(4 * Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet +
                    Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(0))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
                chai_1.expect(round.getBalance(1))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.smallBlindBet);
                chai_1.expect(round.getBalance(2))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(3))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
            });
        });
        it("minimum bets", function () {
            var players = getPlayers(2);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, __assign(__assign({}, Round_1.defaultRoundParameters), { minimumBet: 5 }));
            chai_1.expect(function () { return round.makeBet(0, Round_1.Bet.Raise, 4); }).to["throw"]();
        });
        it("everyone folding after blinds", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Fold);
            round.makeBet(0, Round_1.Bet.Fold);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, Round_1.defaultRoundParameters.anteBet
                    ]
                }]);
            round.makeBet(1, Round_1.Bet.Fold);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getPot()).to.equal(0);
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.smallBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet + 4 * Round_1.defaultRoundParameters.anteBet +
                Round_1.defaultRoundParameters.smallBlindBet + Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
        });
        it("everyone calling first round, then folding", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Call);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                    ]
                }]);
            round.makeBet(0, Round_1.Bet.Call);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                    ]
                }]);
            chai_1.expect(round.getCommunityCards().length).to.equal(0);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                    ]
                }]);
            chai_1.expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Fold);
            round.makeBet(0, Round_1.Bet.Fold);
            round.makeBet(1, Round_1.Bet.Fold);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet + 4 * Round_1.defaultRoundParameters.anteBet +
                4 * Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("everyone calling first two rounds, then folding", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            chai_1.expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Fold);
            round.makeBet(0, Round_1.Bet.Fold);
            round.makeBet(1, Round_1.Bet.Fold);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet + 4 * Round_1.defaultRoundParameters.anteBet +
                4 * Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("everyone calling first three rounds, then folding", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            chai_1.expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.getCommunityCards().length).to.equal(5);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Fold);
            round.makeBet(0, Round_1.Bet.Fold);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                    ]
                }]);
            round.makeBet(1, Round_1.Bet.Fold);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet + 4 * Round_1.defaultRoundParameters.anteBet +
                4 * Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("two players folding, small blind calling then folding", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Fold);
            round.makeBet(0, Round_1.Bet.Fold);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            chai_1.expect(round.getPot())
                .to.equal(4 * Round_1.defaultRoundParameters.anteBet + 2 * Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, Round_1.defaultRoundParameters.anteBet
                    ]
                }]);
            round.makeBet(1, Round_1.Bet.Fold);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet + 4 * Round_1.defaultRoundParameters.anteBet +
                2 * Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet);
        });
        it("one player raising", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            var currentBet = Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet;
            var raiseBy = Round_1.defaultRoundParameters.minimumBet;
            chai_1.expect(round.getCurrentBet()).to.equal(currentBet);
            chai_1.expect(function () { return round.makeBet(3, Round_1.Bet.Raise, -1); }).to["throw"]();
            chai_1.expect(function () { return round.makeBet(3, Round_1.Bet.Raise, 0); }).to["throw"]();
            chai_1.expect(function () { return round.makeBet(3, Round_1.Bet.Raise, STARTING_BALANCE); })
                .to["throw"]();
            round.makeBet(3, Round_1.Bet.Raise, raiseBy);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy,
                    ]
                }]);
            currentBet += raiseBy;
            chai_1.expect(round.getCurrentBet()).to.equal(currentBet);
        });
        it("three players raising", function () {
            var players = getPlayers(4);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            var currentBet = Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet;
            var raiseBy = Round_1.defaultRoundParameters.minimumBet;
            round.makeBet(3, Round_1.Bet.Raise, raiseBy);
            currentBet += raiseBy;
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy,
                    ]
                }]);
            chai_1.expect(round.getCurrentBet()).to.equal(currentBet);
            round.makeBet(0, Round_1.Bet.Raise, raiseBy);
            currentBet += raiseBy;
            chai_1.expect(round.getCurrentBet()).to.equal(currentBet);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 2 * raiseBy,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 2 * raiseBy,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy,
                    ]
                }]);
            round.makeBet(1, Round_1.Bet.Raise, raiseBy);
            currentBet += raiseBy;
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 2 * raiseBy,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy,
                    ]
                }]);
            chai_1.expect(round.getCurrentBet()).to.equal(currentBet);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            chai_1.expect(round.getCommunityCards().length).to.equal(0);
            round.makeBet(0, Round_1.Bet.Call);
            chai_1.expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                    contributions: [
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                        Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                    ]
                }]);
            players.forEach(function (p) { return chai_1.expect(round.getBalance(p.id))
                .to.equal(STARTING_BALANCE - currentBet); });
            chai_1.expect(round.getCommunityCards().length).to.equal(3);
            chai_1.expect(round.getPot()).to.equal(4 * currentBet);
        });
        it("raising by an amount no one can afford", function () {
            var players = getPlayers(4);
            players[3].balance = 3 * STARTING_BALANCE;
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            chai_1.expect(function () { return round.makeBet(3, Round_1.Bet.Raise, STARTING_BALANCE); })
                .to["throw"]();
        });
        describe("side pots", function () {
            it("normal betting", function () {
                var players = getPlayers(4);
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                var currentBet = Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet;
                var raiseBy = Round_1.defaultRoundParameters.minimumBet;
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: currentBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, Round_1.defaultRoundParameters.anteBet
                        ]
                    }]);
                round.makeBet(3, Round_1.Bet.Raise, raiseBy);
                currentBet += raiseBy;
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: currentBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy
                        ]
                    }]);
                round.makeBet(0, Round_1.Bet.Raise, raiseBy);
                currentBet += raiseBy;
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: currentBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 2 * raiseBy,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy
                        ]
                    }]);
                round.makeBet(1, Round_1.Bet.Raise, raiseBy);
                currentBet += raiseBy;
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: currentBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 2 * raiseBy,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + raiseBy
                        ]
                    }]);
                round.makeBet(2, Round_1.Bet.Call);
                round.makeBet(3, Round_1.Bet.Call);
                round.makeBet(0, Round_1.Bet.Call);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: currentBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet + 3 * raiseBy,
                        ]
                    }]);
            });
            it("go all in", function () {
                var players = getPlayers(3);
                players[0].balance = 2 * STARTING_BALANCE;
                players[1].balance = 2 * STARTING_BALANCE;
                players[2].balance = STARTING_BALANCE;
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet, Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                        ]
                    }]);
                round.makeBet(0, Round_1.Bet.Raise, STARTING_BALANCE);
                chai_1.expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.smallBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                        ]
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, 0, 0]
                    }
                ]);
                round.makeBet(1, Round_1.Bet.Call);
                chai_1.expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE, STARTING_BALANCE,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet
                        ]
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, 0
                        ]
                    }
                ]);
                round.makeBet(2, Round_1.Bet.Call);
                chai_1.expect(round.getPot())
                    .to.equal(STARTING_BALANCE +
                    2 * (Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet +
                        STARTING_BALANCE));
                chai_1.expect(round.getBalance(0))
                    .to.equal(2 * STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.bigBlindBet - STARTING_BALANCE);
                chai_1.expect(round.getBalance(1))
                    .to.equal(2 * STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.bigBlindBet - STARTING_BALANCE);
                chai_1.expect(round.getBalance(2)).to.equal(0);
            });
            it("multiple recursive side pots", function () {
                var players = getPlayers(4);
                players[0].balance = 10;
                players[1].balance = 20;
                players[2].balance = 30;
                players[3].balance = 40;
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                chai_1.expect(function () { return round.makeBet(3, Round_1.Bet.Raise, 35); }).to["throw"]();
                round.makeBet(3, Round_1.Bet.Raise, 30 - Round_1.defaultRoundParameters.anteBet - Round_1.defaultRoundParameters.bigBlindBet);
                round.makeBet(0, Round_1.Bet.Call);
                round.makeBet(1, Round_1.Bet.Call);
                round.makeBet(2, Round_1.Bet.Call);
                chai_1.expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: 10,
                        maxMarginalBet: 10,
                        marginalBet: 10,
                        contributions: [
                            10,
                            10,
                            10,
                            10,
                        ]
                    },
                    {
                        maxCumulativeBet: 20,
                        maxMarginalBet: 10,
                        marginalBet: 10,
                        contributions: [
                            0,
                            10,
                            10,
                            10,
                        ]
                    },
                    {
                        maxCumulativeBet: 30,
                        maxMarginalBet: 10,
                        marginalBet: 10,
                        contributions: [
                            0,
                            0,
                            10,
                            10,
                        ]
                    },
                ]);
                chai_1.expect(round.getBalance(0)).to.equal(0);
                chai_1.expect(round.getBalance(1)).to.equal(0);
                chai_1.expect(round.getBalance(2)).to.equal(0);
                chai_1.expect(round.getBalance(3)).to.equal(10);
                round.makeBet(3, Round_1.Bet.Fold);
                chai_1.expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: 10,
                        maxMarginalBet: 10,
                        marginalBet: 10,
                        contributions: [
                            10,
                            10,
                            10,
                            10,
                        ]
                    },
                    {
                        maxCumulativeBet: 20,
                        maxMarginalBet: 10,
                        marginalBet: 10,
                        contributions: [
                            0,
                            10,
                            10,
                            10,
                        ]
                    },
                ]);
                chai_1.expect(round.getBalance(0)).to.equal(0);
                chai_1.expect(round.getBalance(1)).to.equal(0);
                chai_1.expect(round.getBalance(2)).to.equal(20);
                chai_1.expect(round.getBalance(3)).to.equal(10);
            });
            it("main pot win", function () {
                var players = getPlayers(3);
                players[0].balance = 2 * STARTING_BALANCE;
                players[1].balance = 2 * STARTING_BALANCE;
                players[2].balance = STARTING_BALANCE;
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                round.makeBet(0, Round_1.Bet.Raise, STARTING_BALANCE);
                round.makeBet(1, Round_1.Bet.Call);
                round.makeBet(2, Round_1.Bet.Call);
                chai_1.expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                        ]
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, 0
                        ]
                    }
                ]);
                round.makeBet(0, Round_1.Bet.Call);
                round.makeBet(1, Round_1.Bet.Fold);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                        ]
                    }]);
                chai_1.expect(function () { return round.makeBet(2, Round_1.Bet.Fold); }).to["throw"]();
                chai_1.expect(round.getBalance(0))
                    .to.equal(STARTING_BALANCE + Round_1.defaultRoundParameters.anteBet +
                    Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(1))
                    .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                    Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(2)).to.equal(0);
            });
            it("side pot then fold", function () {
                var players = getPlayers(3);
                players[0].balance = 2 * STARTING_BALANCE;
                players[1].balance = 2 * STARTING_BALANCE;
                players[2].balance = STARTING_BALANCE;
                var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
                round.makeBet(0, Round_1.Bet.Raise, STARTING_BALANCE);
                round.makeBet(1, Round_1.Bet.Call);
                round.makeBet(2, Round_1.Bet.Call);
                chai_1.expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                        ]
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                        contributions: [
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet,
                            Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet, 0
                        ]
                    }
                ]);
                chai_1.expect(round.getBalance(0))
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE -
                    Round_1.defaultRoundParameters.anteBet - Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(1))
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE -
                    Round_1.defaultRoundParameters.anteBet - Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(2)).to.equal(0);
                round.makeBet(0, Round_1.Bet.Fold);
                chai_1.expect(round.getPots()).to.deep.equal([{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                        ]
                    }]);
                chai_1.expect(round.getBalance(0))
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE -
                    Round_1.defaultRoundParameters.anteBet - Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(1))
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE +
                    Round_1.defaultRoundParameters.anteBet + Round_1.defaultRoundParameters.bigBlindBet);
                chai_1.expect(round.getBalance(2)).to.equal(0);
                round.makeBet(1, Round_1.Bet.Fold);
                chai_1.expect(round.getBalance(2)).to.equal(3 * STARTING_BALANCE);
            });
        });
    });
    describe("get winners", function () {
        var getPlayerState = function (i, holeCards) {
            return {
                index: i,
                playerId: i,
                balance: STARTING_BALANCE,
                maxStakes: STARTING_BALANCE,
                hasFolded: false,
                holeCards: holeCards,
                amountBetThisRound: 1.0
            };
        };
        var communityCards = [
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
            { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
        ];
        it("one player", function () {
            var ps0 = getPlayerState(0, [
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three }
            ]);
            chai_1.expect(Round_1.getWinners([ps0], communityCards).map(function (ps) { return ps.playerId; }))
                .to.deep.equal([ps0.playerId]);
        });
        describe("two players", function () {
            it("tie", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                    ps1.playerId,
                ]);
            });
            it("tie", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                    ps1.playerId,
                ]);
            });
            it("flush > straight", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                ]);
            });
            it("flush & high card", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Nine },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps1.playerId,
                ]);
            });
        });
        describe("three players", function () {
            it("three-way tie", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                ]);
                var ps2 = getPlayerState(2, [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1, ps2], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                    ps1.playerId,
                    ps2.playerId,
                ]);
            });
            it("three-way tie", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                ]);
                var ps2 = getPlayerState(2, [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ace },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1, ps2], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                    ps1.playerId,
                    ps2.playerId,
                ]);
            });
            it("two-way tie", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                ]);
                var ps2 = getPlayerState(2, [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1, ps2], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                    ps1.playerId,
                ]);
            });
            it("flush > straight", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
                ]);
                var ps2 = getPlayerState(2, [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Four }
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1, ps2], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps0.playerId,
                ]);
            });
            it("straight & high card", function () {
                var ps0 = getPlayerState(0, [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four }
                ]);
                var ps1 = getPlayerState(1, [
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
                ]);
                var ps2 = getPlayerState(2, [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
                ]);
                chai_1.expect(Round_1.getWinners([ps0, ps1, ps2], communityCards)
                    .map(function (ps) { return ps.playerId; }))
                    .to.deep.equal([
                    ps1.playerId,
                    ps2.playerId,
                ]);
            });
        });
    });
    describe("calculate payouts", function () {
        it("single main pot, no side pots", function () {
            var players = getPlayers(3);
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE + 2 * Round_1.defaultRoundParameters.anteBet +
                2 * Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("split main pot, no side pots", function () {
            var players = getPlayers(3);
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace }
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE + 0.5 * Round_1.defaultRoundParameters.anteBet +
                0.5 * Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE + 0.5 * Round_1.defaultRoundParameters.anteBet +
                0.5 * Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("single main + side pot winner", function () {
            var players = getPlayers(3);
            players[0].balance = 2 * STARTING_BALANCE;
            players[1].balance = 2 * STARTING_BALANCE;
            players[2].balance = STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(0, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2)).to.equal(0);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0))
                .to.equal(4 * STARTING_BALANCE + Round_1.defaultRoundParameters.anteBet +
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2)).to.equal(0);
        });
        it("single main pot, single side pot", function () {
            var players = getPlayers(3);
            players[0].balance = STARTING_BALANCE;
            players[1].balance = 2 * STARTING_BALANCE;
            players[2].balance = 2 * STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0)).to.equal(0);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            round.makeBet(2, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0)).to.equal(3 * STARTING_BALANCE);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE + Round_1.defaultRoundParameters.anteBet +
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("split main pot, single side pot", function () {
            var players = getPlayers(3);
            players[0].balance = STARTING_BALANCE;
            players[1].balance = 2 * STARTING_BALANCE;
            players[2].balance = 2 * STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Five },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0)).to.equal(0);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            round.makeBet(2, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0)).to.equal(1.5 * STARTING_BALANCE);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(2.5 * STARTING_BALANCE + Round_1.defaultRoundParameters.anteBet +
                Round_1.defaultRoundParameters.bigBlindBet);
        });
        it("single main pot, split side pot", function () {
            var players = getPlayers(3);
            players[0].balance = STARTING_BALANCE;
            players[1].balance = 2 * STARTING_BALANCE;
            players[2].balance = 2 * STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0)).to.equal(0);
            chai_1.expect(round.getBalance(1))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            round.makeBet(2, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0)).to.equal(3 * STARTING_BALANCE);
            chai_1.expect(round.getBalance(1)).to.equal(STARTING_BALANCE);
            chai_1.expect(round.getBalance(2)).to.equal(STARTING_BALANCE);
        });
        it("split main pot, split side pot", function () {
            var players = getPlayers(4);
            players[0].balance = STARTING_BALANCE;
            players[1].balance = STARTING_BALANCE;
            players[2].balance = 2 * STARTING_BALANCE;
            players[3].balance = 2 * STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0)).to.equal(0);
            chai_1.expect(round.getBalance(1)).to.equal(0);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            round.makeBet(2, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0)).to.equal(2 * STARTING_BALANCE);
            chai_1.expect(round.getBalance(1)).to.equal(2 * STARTING_BALANCE);
            chai_1.expect(round.getBalance(2)).to.equal(STARTING_BALANCE);
            chai_1.expect(round.getBalance(3)).to.equal(STARTING_BALANCE);
        });
        it("split main pot four ways, split side pot", function () {
            var players = getPlayers(4);
            players[0].balance = STARTING_BALANCE;
            players[1].balance = STARTING_BALANCE;
            players[2].balance = 2 * STARTING_BALANCE;
            players[3].balance = 2 * STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Queen },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            chai_1.expect(round.getBalance(0)).to.equal(0);
            chai_1.expect(round.getBalance(1)).to.equal(0);
            chai_1.expect(round.getBalance(2))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            chai_1.expect(round.getBalance(3))
                .to.equal(STARTING_BALANCE - Round_1.defaultRoundParameters.anteBet -
                Round_1.defaultRoundParameters.bigBlindBet);
            round.makeBet(2, Round_1.Bet.Call);
            chai_1.expect(round.isFinished).to.be["true"];
            chai_1.expect(round.getBalance(0)).to.equal(STARTING_BALANCE);
            chai_1.expect(round.getBalance(1)).to.equal(STARTING_BALANCE);
            chai_1.expect(round.getBalance(2)).to.equal(2 * STARTING_BALANCE);
            chai_1.expect(round.getBalance(3)).to.equal(2 * STARTING_BALANCE);
        });
    });
    describe("(de)serialize", function () {
        it("simple", function () {
            var players = getPlayers(2);
            var round = Round_1.Round.create(Card_1.getShuffledDeck(), players, Round_1.defaultRoundParameters);
            chai_1.expect(Round_1.Round.deserialize(JSON.parse(JSON.stringify(round.serialize()))))
                .to.deep.equal(round);
        });
        it("complex", function () {
            var players = getPlayers(4);
            players[0].balance = STARTING_BALANCE;
            players[1].balance = STARTING_BALANCE;
            players[2].balance = 2 * STARTING_BALANCE;
            players[3].balance = 2 * STARTING_BALANCE;
            var round = Round_1.Round.create([
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Queen },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ace },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], players, Round_1.defaultRoundParameters);
            round.makeBet(3, Round_1.Bet.Raise, STARTING_BALANCE);
            round.makeBet(0, Round_1.Bet.Call);
            round.makeBet(1, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            round.makeBet(2, Round_1.Bet.Call);
            round.makeBet(3, Round_1.Bet.Call);
            chai_1.expect(Round_1.Round.deserialize(JSON.parse(JSON.stringify(round.serialize()))))
                .to.deep.equal(round);
        });
    });
});
//# sourceMappingURL=Round.js.map