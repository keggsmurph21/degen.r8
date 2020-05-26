import "mocha";

import {expect} from "chai";

import {Rank, Suit} from "../Card";
import {ADD_BALANCE, CAPACITY} from "../Defaults";
import {defaultRoomParameters as params, Room} from "../Room";
import {Bet} from "../Round";

const STARTING_BALANCE = ADD_BALANCE.DEFAULT;

describe("Room", () => {
    const getPlayers = (num: number) => {
        let players = [];
        for (let i = 0; i < num; ++i)
            players.push(i);
        return players;
    };

    it("create", () => {
        expect(() => Room.create({...params, capacity: CAPACITY.MIN - 1}))
            .to.throw();
        expect(() => Room.create({...params, capacity: CAPACITY.DEFAULT + 0.5}))
            .to.throw();
        expect(() => Room.create({...params, capacity: CAPACITY.MAX + 1}))
            .to.throw();
        const room = Room.create(params);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal([]);
        expect(room.round).to.be.null;
        expect(room.participants).to.be.null;
        expect(room.dealerIndex).to.equal(0);
    });

    it("enter", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        room.enter(0);
        room.enter(1);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal(players);
        expect(room.round).to.be.null;
        expect(() => room.enter(0)).to.throw();
        expect(() => room.enter(1)).to.throw();
    });

    it("leave", () => {
        const room = Room.create(params);
        const players = getPlayers(1);
        expect(() => room.leave(0)).to.throw()
        room.enter(0);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal([0]);
        expect(room.round).to.be.null;
        room.leave(0);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal([]);
        expect(room.round).to.be.null;
        room.enter(0);
        room.sit(0, 0);
        room.leave(0);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal([]);
        expect(room.round).to.be.null;
    });

    it("sit", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        expect(() => room.sit(0, 0)).to.throw();
        room.enter(0);
        expect(() => room.sit(0, -1)).to.throw();
        expect(() => room.sit(0, 0.5)).to.throw();
        expect(() => room.sit(0, params.capacity + 1)).to.throw();
        room.sit(0, 0);
        expect(room.sitting).to.deep.equal([0, null, null, null]);
        expect(room.standing).to.deep.equal([]);
        expect(room.round).to.be.null;
        expect(() => room.sit(0, 1)).to.throw();
        room.enter(1);
        expect(() => room.sit(1, 0)).to.throw();
        room.sit(1, 1);
        expect(room.sitting).to.deep.equal([0, 1, null, null]);
        expect(room.standing).to.deep.equal([]);
        expect(room.round).to.be.null;
    });

    it("stand", () => {
        const room = Room.create(params);
        const players = getPlayers(1);
        expect(() => room.stand(0)).to.throw();
        room.enter(0);
        expect(() => room.stand(0)).to.throw();
        room.sit(0, 0);
        room.stand(0);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal([0]);
        room.sit(0, 2);
        expect(room.sitting).to.deep.equal([null, null, 0, null]);
        expect(room.standing).to.deep.equal([]);
        // leaving directly from sitting
        room.leave(0);
        expect(room.sitting).to.deep.equal([null, null, null, null]);
        expect(room.standing).to.deep.equal([]);
    });

    it("addBalance", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        const balanceToAdd = STARTING_BALANCE;
        room.enter(0);
        expect(room.getBalance(0)).to.equal(0);
        expect(() => room.addBalance(0, 0)).to.throw();
        expect(() => room.addBalance(0, Infinity)).to.throw();
        expect(() => room.addBalance(1, STARTING_BALANCE)).to.throw();
        room.addBalance(0, STARTING_BALANCE);
        expect(room.getBalance(0)).to.equal(STARTING_BALANCE);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        expect(room.getBalance(1)).to.equal(0);
        room.addBalance(1, STARTING_BALANCE);
        expect(room.getBalance(1)).to.equal(STARTING_BALANCE);
        room.startRound();
        expect(room.getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });

    it("startRound", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        expect(() => room.startRound()).to.throw();
        room.enter(0);
        room.sit(0, 0);
        expect(() => room.startRound()).to.throw();
        room.enter(1);
        room.sit(1, 1);
        expect(() => room.startRound()).to.throw();
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        expect(() => room.startRound()).to.not.throw();
        expect(() => room.startRound()).to.throw();
        expect(room.round.getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.smallBlindBet);
        expect(room.round.getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });

    it("makeBet", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        room.makeBet(0, Bet.Call);
        expect(room.round.getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
        expect(room.getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });

    it("multiple rounds", () => {
        const room =
            Room.create(params, () => [
                                    // community cards
                                    {suit: Suit.Diamonds, rank: Rank.Five},
                                    {suit: Suit.Diamonds, rank: Rank.Six},
                                    {suit: Suit.Diamonds, rank: Rank.Seven},
                                    {suit: Suit.Diamonds, rank: Rank.Eight},
                                    {suit: Suit.Clubs, rank: Rank.Ten},
                                    // p1 cards
                                    {suit: Suit.Spades, rank: Rank.Two},
                                    {suit: Suit.Spades, rank: Rank.Four},
                                    // p0 cards (flush)
                                    {suit: Suit.Hearts, rank: Rank.Two},
                                    {suit: Suit.Diamonds, rank: Rank.Three},
        ]);
        const players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        room.makeBet(0, Bet.Call);
        room.makeBet(1, Bet.Call);
        room.makeBet(0, Bet.Call);
        room.makeBet(1, Bet.Call);
        room.makeBet(0, Bet.Call);
        room.makeBet(1, Bet.Call);
        room.makeBet(0, Bet.Call);
        expect(room.getBalance(0))
            .to.equal(STARTING_BALANCE + params.anteBet + params.bigBlindBet);
        expect(room.getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
        expect(room.round).to.be.null;
        expect(room.participants).to.be.null;
        expect(room.dealerIndex).to.equal(1);
    });

    it("(de)serialize", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        room.enter(0);
        room.sit(0, 0);
        room.enter(1);
        room.sit(1, 1);
        expect(Room.deserialize(JSON.parse(JSON.stringify(room.serialize()))))
            .to.deep.equal(room);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        room.startRound();
        expect(Room.deserialize(JSON.parse(JSON.stringify(room.serialize()))))
            .to.deep.equal(room);
    });

    it("view for", () => {
        const room =
            Room.create(params, () => [{suit: Suit.Hearts, rank: Rank.Two},
                                       {suit: Suit.Hearts, rank: Rank.Three},
                                       {suit: Suit.Clubs, rank: Rank.Four},
                                       {suit: Suit.Clubs, rank: Rank.Five},
                                       {suit: Suit.Diamonds, rank: Rank.Seven},
                                       {suit: Suit.Diamonds, rank: Rank.Eight},
                                       {suit: Suit.Spades, rank: Rank.Nine},
                                       {suit: Suit.Spades, rank: Rank.Ten},
                                       {suit: Suit.Hearts, rank: Rank.Queen},
        ]);
        const players = getPlayers(3);
        expect(room.viewFor(0)).to.deep.equal(null);
        room.enter(0);
        expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: false,
            isCurrentPlayer: false,
            params,
            sitting: [null, null, null, null],
            standing: [0],
            participants: null,
            isSitting: false,
            isStanding: true,
            isPlaying: false,
            balances: {0: 0},
            round: null,
        });
        expect(room.viewFor(1)).to.deep.equal(null);
        room.enter(1);
        room.sit(0, 0);
        expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: false,
            isCurrentPlayer: false,
            params,
            sitting: [0, null, null, null],
            standing: [1],
            participants: null,
            isSitting: true,
            isStanding: false,
            isPlaying: false,
            balances: {0: 0, 1: 0},
            round: null,
        });
        expect(room.viewFor(1)).to.deep.equal({
            playerId: 1,
            canStartRound: false,
            isCurrentPlayer: false,
            params,
            sitting: [0, null, null, null],
            standing: [1],
            participants: null,
            isSitting: false,
            isStanding: true,
            isPlaying: false,
            balances: {0: 0, 1: 0},
            round: null,
        });
        expect(room.viewFor(2)).to.deep.equal(null);
        room.sit(1, 1);
        room.addBalance(0, STARTING_BALANCE);
        room.addBalance(1, STARTING_BALANCE);
        expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: true,
            isCurrentPlayer: false,
            params,
            sitting: [0, 1, null, null],
            standing: [],
            participants: null,
            isSitting: true,
            isStanding: false,
            isPlaying: false,
            balances: {
                0: STARTING_BALANCE,
                1: STARTING_BALANCE,
            },
            round: null,
        });
        room.startRound();
        expect(room.viewFor(0)).to.deep.equal({
            playerId: 0,
            canStartRound: false,
            isCurrentPlayer: true,
            params,
            sitting: [0, 1, null, null],
            standing: [],
            participants: [0, 1],
            isSitting: true,
            isStanding: false,
            isPlaying: true,
            balances: {
                0: STARTING_BALANCE - params.anteBet - params.smallBlindBet,
                1: STARTING_BALANCE - params.anteBet - params.bigBlindBet
            },
            round: {
                playerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - params.anteBet -
                                     params.smallBlindBet,
                        hasFolded: false,
                        holeCards: [
                            {suit: Suit.Hearts, rank: Rank.Queen},
                            {suit: Suit.Spades, rank: Rank.Ten},
                        ],
                        maxStakes: STARTING_BALANCE
                    },
                    {
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - params.anteBet -
                                     params.bigBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE,
                    }
                ],
                minimumBet: params.minimumBet,
                currentIndex: 0,
                communityCards: [null, null, null, null, null],
                pots: [{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: params.anteBet + params.bigBlindBet,
                    contributions: [
                        params.anteBet + params.smallBlindBet,
                        params.anteBet + params.bigBlindBet
                    ],
                }],
                didLastRaiseIndex: 1,
                isFinished: false,
            }
        });
        expect(Room.deserialize(JSON.parse(JSON.stringify(room.serialize())))
                   .viewFor(1))
            .to.deep.equal({
                playerId: 1,
                canStartRound: false,
                isCurrentPlayer: false,
                params,
                sitting: [0, 1, null, null],
                standing: [],
                participants: [0, 1],
                isSitting: true,
                isStanding: false,
                isPlaying: true,
                balances: {
                    0: STARTING_BALANCE - params.anteBet - params.smallBlindBet,
                    1: STARTING_BALANCE - params.anteBet - params.bigBlindBet
                },
                round: {
                    playerStates: [
                        {
                            index: 0,
                            playerId: 0,
                            balance: STARTING_BALANCE - params.anteBet -
                                         params.smallBlindBet,
                            hasFolded: false,
                            holeCards: null,
                            maxStakes: STARTING_BALANCE,
                        },
                        {
                            index: 1,
                            playerId: 1,
                            balance: STARTING_BALANCE - params.anteBet -
                                         params.bigBlindBet,
                            hasFolded: false,
                            holeCards: [
                                {suit: Suit.Spades, rank: Rank.Nine},
                                {suit: Suit.Diamonds, rank: Rank.Eight},
                            ],
                            maxStakes: STARTING_BALANCE
                        }
                    ],
                    minimumBet: params.minimumBet,
                    currentIndex: 0,
                    communityCards: [null, null, null, null, null],
                    pots: [{
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.smallBlindBet,
                            params.anteBet + params.bigBlindBet
                        ],
                    }],
                    didLastRaiseIndex: 1,
                    isFinished: false,
                }
            });
        expect(room.viewFor(2)).to.deep.equal(null);
        room.enter(2);
        expect(room.viewFor(2)).to.deep.equal({
            playerId: 2,
            canStartRound: false,
            isCurrentPlayer: false,
            params,
            sitting: [0, 1, null, null],
            standing: [2],
            participants: [0, 1],
            isSitting: false,
            isStanding: true,
            isPlaying: false,
            balances: {
                0: STARTING_BALANCE - params.anteBet - params.smallBlindBet,
                1: STARTING_BALANCE - params.anteBet - params.bigBlindBet,
                2: 0,
            },
            round: {
                playerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - params.anteBet -
                                     params.smallBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE,
                    },
                    {
                        index: 1,
                        playerId: 1,
                        balance: STARTING_BALANCE - params.anteBet -
                                     params.bigBlindBet,
                        hasFolded: false,
                        holeCards: null,
                        maxStakes: STARTING_BALANCE
                    }
                ],
                minimumBet: params.minimumBet,
                currentIndex: 0,
                communityCards: [null, null, null, null, null],
                pots: [{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: params.anteBet + params.bigBlindBet,
                    contributions: [
                        params.anteBet + params.smallBlindBet,
                        params.anteBet + params.bigBlindBet
                    ],
                }],
                didLastRaiseIndex: 1,
                isFinished: false,
            }
        });
    });
});
