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
var Room_1 = require("../Room");
var Round_1 = require("../Round");
var MINIMUM_BET = 1.00;
var STARTING_BALANCE = 20.00;
var params = {
    capacity: 4,
    autoplayInterval: 0,
    minimumBet: MINIMUM_BET,
    useBlinds: true,
    bigBlindBet: MINIMUM_BET,
    smallBlindBet: MINIMUM_BET / 2,
    useAntes: true,
    anteBet: MINIMUM_BET / 2
};
describe("Room", function () {
    var getPlayers = function (num) {
        var players = [];
        for (var i = 0; i < num; ++i)
            players.push(i);
        return players;
    };
    it("create", function () {
        chai_1.expect(function () { return Room_1.Room.create(__assign(__assign({}, params), { capacity: Room_1.MIN_CAPACITY - 1 })); })
            .to["throw"]();
        chai_1.expect(function () { return Room_1.Room.create(__assign(__assign({}, params), { capacity: Room_1.MIN_CAPACITY + 0.5 })); })
            .to["throw"]();
        chai_1.expect(function () { return Room_1.Room.create(__assign(__assign({}, params), { capacity: Room_1.MAX_CAPACITY + 1 })); })
            .to["throw"]();
        var room = Room_1.Room.create(params);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
        chai_1.expect(room.getRound()).to.be["null"];
        chai_1.expect(room.getParticipants()).to.be["null"];
        chai_1.expect(room.getDealerIndex()).to.equal(0);
    });
    it("enter", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(2);
        room.enter(0);
        room.enter(1);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal(players);
        chai_1.expect(room.getRound()).to.be["null"];
        chai_1.expect(function () { return room.enter(0); }).to["throw"]();
        chai_1.expect(function () { return room.enter(1); }).to["throw"]();
    });
    it("leave", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(1);
        chai_1.expect(function () { return room.leave(0); }).to["throw"]();
        room.enter(0);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([0]);
        chai_1.expect(room.getRound()).to.be["null"];
        room.leave(0);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
        chai_1.expect(room.getRound()).to.be["null"];
        room.enter(0);
        room.sit(0, 0);
        room.leave(0);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
        chai_1.expect(room.getRound()).to.be["null"];
    });
    it("sit", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(2);
        chai_1.expect(function () { return room.sit(0, 0); }).to["throw"]();
        room.enter(0);
        chai_1.expect(function () { return room.sit(0, -1); }).to["throw"]();
        chai_1.expect(function () { return room.sit(0, 0.5); }).to["throw"]();
        chai_1.expect(function () { return room.sit(0, params.capacity + 1); }).to["throw"]();
        room.sit(0, 0);
        chai_1.expect(room.getSitting()).to.deep.equal([0, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
        chai_1.expect(room.getRound()).to.be["null"];
        chai_1.expect(function () { return room.sit(0, 1); }).to["throw"]();
        room.enter(1);
        chai_1.expect(function () { return room.sit(1, 0); }).to["throw"]();
        room.sit(1, 1);
        chai_1.expect(room.getSitting()).to.deep.equal([0, 1, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
        chai_1.expect(room.getRound()).to.be["null"];
    });
    it("stand", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(1);
        chai_1.expect(function () { return room.stand(0); }).to["throw"]();
        room.enter(0);
        chai_1.expect(function () { return room.stand(0); }).to["throw"]();
        room.sit(0, 0);
        room.stand(0);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([0]);
        room.sit(0, 2);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, 0, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
        room.leave(0);
        chai_1.expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.getStanding()).to.deep.equal([]);
    });
    it("addBalance", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(2);
        var balanceToAdd = STARTING_BALANCE;
        room.enter(0);
        chai_1.expect(room.getBalance(0)).to.equal(0);
        chai_1.expect(function () { return room.addBalance(0, 0); }).to["throw"]();
        chai_1.expect(function () { return room.addBalance(0, Infinity); }).to["throw"]();
        chai_1.expect(function () { return room.addBalance(1, STARTING_BALANCE); }).to["throw"]();
        room.addBalance(0, STARTING_BALANCE);
        chai_1.expect(room.getBalance(0)).to.equal(STARTING_BALANCE);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        chai_1.expect(room.getBalance(1)).to.equal(0);
        room.addBalance(1, STARTING_BALANCE);
        chai_1.expect(room.getBalance(1)).to.equal(STARTING_BALANCE);
        room.startRound();
        chai_1.expect(room.getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });
    it("startRound", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(2);
        chai_1.expect(function () { return room.startRound(); }).to["throw"]();
        room.enter(0);
        room.sit(0, 0);
        chai_1.expect(function () { return room.startRound(); }).to["throw"]();
        room.enter(1);
        room.sit(1, 1);
        chai_1.expect(function () { return room.startRound(); }).to["throw"]();
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        chai_1.expect(function () { return room.startRound(); }).to.not["throw"]();
        chai_1.expect(function () { return room.startRound(); }).to["throw"]();
        chai_1.expect(room.getRound().getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.smallBlindBet);
        chai_1.expect(room.getRound().getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });
    it("makeBet", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        room.makeBet(0, Round_1.Bet.Call);
        chai_1.expect(room.getRound().getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
        chai_1.expect(room.getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });
    it("multiple rounds", function () {
        var room = Room_1.Room.create(params, function () { return [
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Five },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Six },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
            { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
            { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
            { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
            { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
        ]; });
        var players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        room.makeBet(0, Round_1.Bet.Call);
        room.makeBet(1, Round_1.Bet.Call);
        room.makeBet(0, Round_1.Bet.Call);
        room.makeBet(1, Round_1.Bet.Call);
        room.makeBet(0, Round_1.Bet.Call);
        room.makeBet(1, Round_1.Bet.Call);
        room.makeBet(0, Round_1.Bet.Call);
        chai_1.expect(room.getBalance(0))
            .to.equal(STARTING_BALANCE + params.anteBet + params.bigBlindBet);
        chai_1.expect(room.getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
        chai_1.expect(room.getRound()).to.be["null"];
        chai_1.expect(room.getParticipants()).to.be["null"];
        chai_1.expect(room.getDealerIndex()).to.equal(1);
    });
    it("(de)serialize", function () {
        var room = Room_1.Room.create(params);
        var players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        chai_1.expect(Room_1.Room.deserialize(JSON.parse(JSON.stringify(room.serialize()))))
            .to.deep.equal(room);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        chai_1.expect(Room_1.Room.deserialize(JSON.parse(JSON.stringify(room.serialize()))))
            .to.deep.equal(room);
    });
    it("view for", function () {
        var room = Room_1.Room.create(params, function () { return [{ suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
            { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
            { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Four },
            { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Seven },
            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
            { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
            { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
            { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
        ]; });
        var players = getPlayers(3);
        chai_1.expect(room.viewFor(0)).to.deep.equal(null);
        room.enter(0);
        chai_1.expect(room.viewFor(0)).to.deep.equal({
            params: params,
            sitting: [null, null, null, null],
            standing: [0],
            participants: null,
            balances: { 0: 0 },
            round: null
        });
        chai_1.expect(room.viewFor(1)).to.deep.equal(null);
        room.enter(1);
        room.sit(0, 0);
        chai_1.expect(room.viewFor(0)).to.deep.equal({
            params: params,
            sitting: [0, null, null, null],
            standing: [1],
            participants: null,
            balances: { 0: 0, 1: 0 },
            round: null
        });
        chai_1.expect(room.viewFor(1)).to.deep.equal({
            params: params,
            sitting: [0, null, null, null],
            standing: [1],
            participants: null,
            balances: { 0: 0, 1: 0 },
            round: null
        });
        chai_1.expect(room.viewFor(2)).to.deep.equal(null);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        chai_1.expect(room.viewFor(0)).to.deep.equal({
            params: params,
            sitting: [0, 1, null, null],
            standing: [],
            participants: [0, 1],
            balances: {
                0: STARTING_BALANCE - params.anteBet - params.smallBlindBet,
                1: STARTING_BALANCE - params.anteBet - params.bigBlindBet
            },
            round: {
                myPlayerState: {
                    index: 0,
                    playerId: 0,
                    balance: STARTING_BALANCE - params.anteBet -
                        params.smallBlindBet,
                    hasFolded: false,
                    holeCards: [
                        { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                        { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    ],
                    maxStakes: STARTING_BALANCE
                },
                otherPlayerStates: [{
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - params.anteBet - params.bigBlindBet,
                        hasFolded: false,
                        maxStakes: STARTING_BALANCE
                    }],
                minimumBet: params.minimumBet,
                currentIndex: 0,
                communityCards: [],
                pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.smallBlindBet,
                            params.anteBet + params.bigBlindBet
                        ]
                    }],
                didLastRaiseIndex: 1,
                isFinished: false
            }
        });
        chai_1.expect(Room_1.Room.deserialize(JSON.parse(JSON.stringify(room.serialize())))
            .viewFor(1))
            .to.deep.equal({
            params: params,
            sitting: [0, 1, null, null],
            standing: [],
            participants: [0, 1],
            balances: {
                0: STARTING_BALANCE - params.anteBet - params.smallBlindBet,
                1: STARTING_BALANCE - params.anteBet - params.bigBlindBet
            },
            round: {
                myPlayerState: {
                    index: 1,
                    playerId: 1,
                    balance: STARTING_BALANCE - params.anteBet -
                        params.bigBlindBet,
                    hasFolded: false,
                    holeCards: [
                        { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
                        { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                    ],
                    maxStakes: STARTING_BALANCE
                },
                otherPlayerStates: [{
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - params.anteBet -
                            params.smallBlindBet,
                        hasFolded: false,
                        maxStakes: STARTING_BALANCE
                    }],
                minimumBet: params.minimumBet,
                currentIndex: 0,
                communityCards: [],
                pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.smallBlindBet,
                            params.anteBet + params.bigBlindBet
                        ]
                    }],
                didLastRaiseIndex: 1,
                isFinished: false
            }
        });
        chai_1.expect(room.viewFor(2)).to.deep.equal(null);
        room.enter(2);
        chai_1.expect(room.viewFor(2)).to.deep.equal({
            params: params,
            sitting: [0, 1, null, null],
            standing: [2],
            participants: [0, 1],
            balances: {
                0: STARTING_BALANCE - params.anteBet - params.smallBlindBet,
                1: STARTING_BALANCE - params.anteBet - params.bigBlindBet,
                2: 0
            },
            round: {
                myPlayerState: null,
                otherPlayerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - params.anteBet -
                            params.smallBlindBet,
                        hasFolded: false,
                        maxStakes: STARTING_BALANCE
                    },
                    {
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - params.anteBet -
                            params.bigBlindBet,
                        hasFolded: false,
                        maxStakes: STARTING_BALANCE
                    }
                ],
                minimumBet: params.minimumBet,
                currentIndex: 0,
                communityCards: [],
                pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.smallBlindBet,
                            params.anteBet + params.bigBlindBet
                        ]
                    }],
                didLastRaiseIndex: 1,
                isFinished: false
            }
        });
    });
});
//# sourceMappingURL=Room.js.map