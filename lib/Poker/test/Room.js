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
var Room_1 = require("../Room");
var Round_1 = require("../Round");
var STARTING_BALANCE = Defaults_1.ADD_BALANCE.DEFAULT;
describe("Room", function () {
    var getPlayers = function (num) {
        var players = [];
        for (var i = 0; i < num; ++i)
            players.push(i);
        return players;
    };
    it("create", function () {
        chai_1.expect(function () { return Room_1.Room.create(__assign(__assign({}, Room_1.defaultRoomParameters), { capacity: Defaults_1.CAPACITY.MIN - 1 })); })
            .to["throw"]();
        chai_1.expect(function () { return Room_1.Room.create(__assign(__assign({}, Room_1.defaultRoomParameters), { capacity: Defaults_1.CAPACITY.DEFAULT + 0.5 })); })
            .to["throw"]();
        chai_1.expect(function () { return Room_1.Room.create(__assign(__assign({}, Room_1.defaultRoomParameters), { capacity: Defaults_1.CAPACITY.MAX + 1 })); })
            .to["throw"]();
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
        chai_1.expect(room.round).to.be["null"];
        chai_1.expect(room.participants).to.be["null"];
        chai_1.expect(room.dealerIndex).to.equal(0);
    });
    it("enter", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
        var players = getPlayers(2);
        room.enter(0);
        room.enter(1);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal(players);
        chai_1.expect(room.round).to.be["null"];
        chai_1.expect(function () { return room.enter(0); }).to["throw"]();
        chai_1.expect(function () { return room.enter(1); }).to["throw"]();
    });
    it("leave", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
        var players = getPlayers(1);
        chai_1.expect(function () { return room.leave(0); }).to["throw"]();
        room.enter(0);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([0]);
        chai_1.expect(room.round).to.be["null"];
        room.leave(0);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
        chai_1.expect(room.round).to.be["null"];
        room.enter(0);
        room.sit(0, 0);
        room.leave(0);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
        chai_1.expect(room.round).to.be["null"];
    });
    it("sit", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
        var players = getPlayers(2);
        chai_1.expect(function () { return room.sit(0, 0); }).to["throw"]();
        room.enter(0);
        chai_1.expect(function () { return room.sit(0, -1); }).to["throw"]();
        chai_1.expect(function () { return room.sit(0, 0.5); }).to["throw"]();
        chai_1.expect(function () { return room.sit(0, Room_1.defaultRoomParameters.capacity + 1); }).to["throw"]();
        room.sit(0, 0);
        chai_1.expect(room.sitting).to.deep.equal([0, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
        chai_1.expect(room.round).to.be["null"];
        chai_1.expect(function () { return room.sit(0, 1); }).to["throw"]();
        room.enter(1);
        chai_1.expect(function () { return room.sit(1, 0); }).to["throw"]();
        room.sit(1, 1);
        chai_1.expect(room.sitting).to.deep.equal([0, 1, null, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
        chai_1.expect(room.round).to.be["null"];
    });
    it("stand", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
        var players = getPlayers(1);
        chai_1.expect(function () { return room.stand(0); }).to["throw"]();
        room.enter(0);
        chai_1.expect(function () { return room.stand(0); }).to["throw"]();
        room.sit(0, 0);
        room.stand(0);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([0]);
        room.sit(0, 2);
        chai_1.expect(room.sitting).to.deep.equal([null, null, 0, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
        room.leave(0);
        chai_1.expect(room.sitting).to.deep.equal([null, null, null, null]);
        chai_1.expect(room.standing).to.deep.equal([]);
    });
    it("addBalance", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
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
            .to.equal(STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet);
    });
    it("startRound", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
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
        chai_1.expect(room.round.getBalance(0))
            .to.equal(STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.smallBlindBet);
        chai_1.expect(room.round.getBalance(1))
            .to.equal(STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet);
    });
    it("makeBet", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
        var players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        room.makeBet(0, Round_1.Bet.Call);
        chai_1.expect(room.round.getBalance(0))
            .to.equal(STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet);
        chai_1.expect(room.getBalance(0))
            .to.equal(STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet);
    });
    it("multiple rounds", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters, function () { return [
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
            .to.equal(STARTING_BALANCE + Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet);
        chai_1.expect(room.getBalance(1))
            .to.equal(STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet);
        chai_1.expect(room.round).to.be["null"];
        chai_1.expect(room.participants).to.be["null"];
        chai_1.expect(room.dealerIndex).to.equal(1);
    });
    it("(de)serialize", function () {
        var room = Room_1.Room.create(Room_1.defaultRoomParameters);
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
        var room = Room_1.Room.create(Room_1.defaultRoomParameters, function () { return [{ suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
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
            playerId: 0,
            canStartRound: false,
            isCurrentPlayer: false,
            params: Room_1.defaultRoomParameters,
            sitting: [null, null, null, null],
            standing: [0],
            participants: null,
            isSitting: false,
            isStanding: true,
            isPlaying: false,
            balances: { 0: 0 },
            round: null
        });
        chai_1.expect(room.viewFor(1)).to.deep.equal(null);
        room.enter(1);
        room.sit(0, 0);
        chai_1.expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: false,
            isCurrentPlayer: false,
            params: Room_1.defaultRoomParameters,
            sitting: [0, null, null, null],
            standing: [1],
            participants: null,
            isSitting: true,
            isStanding: false,
            isPlaying: false,
            balances: { 0: 0, 1: 0 },
            round: null
        });
        chai_1.expect(room.viewFor(1)).to.deep.equal({
            playerId: 1,
            canStartRound: false,
            isCurrentPlayer: false,
            params: Room_1.defaultRoomParameters,
            sitting: [0, null, null, null],
            standing: [1],
            participants: null,
            isSitting: false,
            isStanding: true,
            isPlaying: false,
            balances: { 0: 0, 1: 0 },
            round: null
        });
        chai_1.expect(room.viewFor(2)).to.deep.equal(null);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        chai_1.expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: true,
            isCurrentPlayer: false,
            params: Room_1.defaultRoomParameters,
            sitting: [0, 1, null, null],
            standing: [],
            participants: null,
            isSitting: true,
            isStanding: false,
            isPlaying: false,
            balances: {
                0: STARTING_BALANCE,
                1: STARTING_BALANCE
            },
            round: null
        });
        room.startRound();
        chai_1.expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: false,
            isCurrentPlayer: true,
            params: Room_1.defaultRoomParameters,
            sitting: [0, 1, null, null],
            standing: [],
            participants: [0, 1],
            isSitting: true,
            isStanding: false,
            isPlaying: true,
            balances: {
                0: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.smallBlindBet,
                1: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet
            },
            round: {
                playerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet -
                            Room_1.defaultRoomParameters.smallBlindBet,
                        hasFolded: false,
                        holeCards: [
                            { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                            { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                        ],
                        maxStakes: STARTING_BALANCE
                    },
                    {
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet -
                            Room_1.defaultRoomParameters.bigBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE
                    }
                ],
                minimumBet: Room_1.defaultRoomParameters.minimumBet,
                currentIndex: 0,
                communityCards: [null, null, null, null, null],
                pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet,
                        contributions: [
                            Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.smallBlindBet,
                            Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet
                        ]
                    }],
                didLastRaiseIndex: 1,
                isFinished: false
            }
        });
        chai_1.expect(Room_1.Room.deserialize(JSON.parse(JSON.stringify(room.serialize())))
            .viewFor(1))
            .to.deep.equal({
            playerId: 1,
            canStartRound: false,
            isCurrentPlayer: false,
            params: Room_1.defaultRoomParameters,
            sitting: [0, 1, null, null],
            standing: [],
            participants: [0, 1],
            isSitting: true,
            isStanding: false,
            isPlaying: true,
            balances: {
                0: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.smallBlindBet,
                1: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet
            },
            round: {
                playerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet -
                            Room_1.defaultRoomParameters.smallBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE
                    },
                    {
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet -
                            Room_1.defaultRoomParameters.bigBlindBet,
                        hasFolded: false,
                        holeCards: [
                            { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
                            { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Eight },
                        ],
                        maxStakes: STARTING_BALANCE
                    }
                ],
                minimumBet: Room_1.defaultRoomParameters.minimumBet,
                currentIndex: 0,
                communityCards: [null, null, null, null, null],
                pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet,
                        contributions: [
                            Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.smallBlindBet,
                            Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet
                        ]
                    }],
                didLastRaiseIndex: 1,
                isFinished: false
            }
        });
        chai_1.expect(room.viewFor(2)).to.deep.equal(null);
        room.enter(2);
        chai_1.expect(room.viewFor(2)).to.deep.equal({
            playerId: 2,
            canStartRound: false,
            isCurrentPlayer: false,
            params: Room_1.defaultRoomParameters,
            sitting: [0, 1, null, null],
            standing: [2],
            participants: [0, 1],
            isSitting: false,
            isStanding: true,
            isPlaying: false,
            balances: {
                0: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.smallBlindBet,
                1: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet - Room_1.defaultRoomParameters.bigBlindBet,
                2: 0
            },
            round: {
                playerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet -
                            Room_1.defaultRoomParameters.smallBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE
                    },
                    {
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - Room_1.defaultRoomParameters.anteBet -
                            Room_1.defaultRoomParameters.bigBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE
                    }
                ],
                minimumBet: Room_1.defaultRoomParameters.minimumBet,
                currentIndex: 0,
                communityCards: [null, null, null, null, null],
                pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet,
                        contributions: [
                            Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.smallBlindBet,
                            Room_1.defaultRoomParameters.anteBet + Room_1.defaultRoomParameters.bigBlindBet
                        ]
                    }],
                didLastRaiseIndex: 1,
                isFinished: false
            }
        });
    });
});
//# sourceMappingURL=Room.js.map