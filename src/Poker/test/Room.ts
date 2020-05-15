import "mocha";

import {expect} from "chai";

import {Rank, Suit} from "../Card";
import {MAX_CAPACITY, MIN_CAPACITY, Room} from "../Room";
import {Bet} from "../Round";

const MINIMUM_BET = 1.00;
const STARTING_BALANCE = 20.00;
const params = {
    capacity: 4,
    autoplayInterval: 0,
    // round params
    minimumBet: MINIMUM_BET,
    useBlinds: true,
    bigBlindBet: MINIMUM_BET,
    smallBlindBet: MINIMUM_BET / 2,
    useAntes: true,
    anteBet: MINIMUM_BET / 2,
};

describe("Room", () => {
    const getPlayers = num => {
        let players = [];
        for (let i = 0; i < num; ++i)
            players.push(
                {balance: STARTING_BALANCE, id: i, name: `player${i}`});
        return players;
    };

    it("create", () => {
        expect(() => Room.create({...params, capacity: MIN_CAPACITY - 1}))
            .to.throw();
        expect(() => Room.create({...params, capacity: MIN_CAPACITY + 0.5}))
            .to.throw();
        expect(() => Room.create({...params, capacity: MAX_CAPACITY + 1}))
            .to.throw();
        const room = Room.create(params);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal([]);
        expect(room.getRound()).to.be.null;
        expect(room.getParticipants()).to.be.null;
        expect(room.getDealerIndex()).to.equal(0);
    });

    it("enter", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        room.enter(players[0]);
        room.enter(players[1]);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal(players);
        expect(room.getRound()).to.be.null;
        expect(() => room.enter(players[0])).to.throw();
        expect(() => room.enter(players[1])).to.throw();
    });

    it("leave", () => {
        const room = Room.create(params);
        const players = getPlayers(1);
        expect(() => room.leave(players[0])).to.throw()
        room.enter(players[0]);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal([players[0]]);
        expect(room.getRound()).to.be.null;
        room.leave(players[0]);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal([]);
        expect(room.getRound()).to.be.null;
        room.enter(players[0]);
        room.sit(players[0], 0);
        room.leave(players[0]);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal([]);
        expect(room.getRound()).to.be.null;
    });

    it("sit", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        expect(() => room.sit(players[0], 0)).to.throw();
        room.enter(players[0]);
        expect(() => room.sit(players[0], -1)).to.throw();
        expect(() => room.sit(players[0], 0.5)).to.throw();
        expect(() => room.sit(players[0], params.capacity + 1)).to.throw();
        room.sit(players[0], 0);
        expect(room.getSitting()).to.deep.equal([players[0], null, null, null]);
        expect(room.getStanding()).to.deep.equal([]);
        expect(room.getRound()).to.be.null;
        expect(() => room.sit(players[0], 1)).to.throw();
        room.enter(players[1]);
        expect(() => room.sit(players[1], 0)).to.throw();
        room.sit(players[1], 1);
        expect(room.getSitting()).to.deep.equal([
            players[0], players[1], null, null
        ]);
        expect(room.getStanding()).to.deep.equal([]);
        expect(room.getRound()).to.be.null;
    });

    it("stand", () => {
        const room = Room.create(params);
        const players = getPlayers(1);
        expect(() => room.stand(players[0])).to.throw();
        room.enter(players[0]);
        expect(() => room.stand(players[0])).to.throw();
        room.sit(players[0], 0);
        room.stand(players[0]);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal([players[0]]);
        room.sit(players[0], 2);
        expect(room.getSitting()).to.deep.equal([null, null, players[0], null]);
        expect(room.getStanding()).to.deep.equal([]);
        // leaving directly from sitting
        room.leave(players[0]);
        expect(room.getSitting()).to.deep.equal([null, null, null, null]);
        expect(room.getStanding()).to.deep.equal([]);
    });

    it("startRound", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        expect(() => room.startRound()).to.throw();
        room.enter(players[0]);
        room.sit(players[0], 0);
        expect(() => room.startRound()).to.throw();
        room.enter(players[1]);
        room.sit(players[1], 1);
        expect(() => room.startRound()).to.not.throw();
        expect(() => room.startRound()).to.throw();
        expect(room.getRound().getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.smallBlindBet);
        expect(room.getRound().getBalance(1))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
    });

    it("makeBet", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        room.enter(players[0]);
        room.sit(players[0], 0);
        room.enter(players[1]);
        room.sit(players[1], 1);
        room.startRound();
        room.makeBet(players[0], Bet.Call);
        expect(room.getRound().getBalance(0))
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
        expect(players[0].balance)
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
        room.enter(players[0]);
        room.sit(players[0], 0);
        room.enter(players[1]);
        room.sit(players[1], 1);
        room.startRound();
        room.makeBet(players[0], Bet.Call);
        room.makeBet(players[1], Bet.Call);
        room.makeBet(players[0], Bet.Call);
        room.makeBet(players[1], Bet.Call);
        room.makeBet(players[0], Bet.Call);
        room.makeBet(players[1], Bet.Call);
        room.makeBet(players[0], Bet.Call);
        expect(players[0].balance)
            .to.equal(STARTING_BALANCE + params.anteBet + params.bigBlindBet);
        expect(players[1].balance)
            .to.equal(STARTING_BALANCE - params.anteBet - params.bigBlindBet);
        expect(room.getRound()).to.be.null;
        expect(room.getParticipants()).to.be.null;
        expect(room.getDealerIndex()).to.equal(1);
    });

    it("(de)serialize", () => {
        const room = Room.create(params);
        const players = getPlayers(2);
        room.enter(players[0]);
        room.sit(players[0], 0);
        room.enter(players[1]);
        room.sit(players[1], 1);
        expect(Room.deserialize(JSON.parse(JSON.stringify(room.serialize()))))
            .to.deep.equal(room);
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
        expect(room.viewFor(players[0])).to.deep.equal(null);
        room.enter(players[0]);
        expect(room.viewFor(players[0])).to.deep.equal({
            params,
            sitting: [null, null, null, null],
            standing: [players[0]],
            round: null,
        });
        expect(room.viewFor(players[1])).to.deep.equal(null);
        room.enter(players[1]);
        room.sit(players[0], 0);
        expect(room.viewFor(players[0])).to.deep.equal({
            params,
            sitting: [players[0], null, null, null],
            standing: [players[1]],
            round: null,
        });
        expect(room.viewFor(players[1])).to.deep.equal({
            params,
            sitting: [players[0], null, null, null],
            standing: [players[1]],
            round: null,
        });
        expect(room.viewFor(players[2])).to.deep.equal(null);
        room.sit(players[1], 1);
        room.startRound();
        expect(room.viewFor(players[0])).to.deep.equal({
            params,
            sitting: [players[0], players[1], null, null],
            standing: [],
            round: {
                myPlayerState: {
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
                otherPlayerStates: [{
                    index: 1,
                    playerId: 1,
                    balance:
                        STARTING_BALANCE - params.anteBet - params.bigBlindBet,
                    hasFolded: false,
                    maxStakes: STARTING_BALANCE,
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
                    ],
                }],
                didLastRaiseIndex: 1,
                isFinished: false,
            }
        });
        expect(Room.deserialize(JSON.parse(JSON.stringify(room.serialize())))
                   .viewFor(players[1]))
            .to.deep.equal({
                params,
                sitting: [players[0], players[1], null, null],
                standing: [],
                round: {
                    myPlayerState: {
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
                    },
                    otherPlayerStates: [{
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - params.anteBet -
                                     params.smallBlindBet,
                        hasFolded: false,
                        maxStakes: STARTING_BALANCE,
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
                        ],
                    }],
                    didLastRaiseIndex: 1,
                    isFinished: false,
                }
            });
        expect(room.viewFor(players[2])).to.deep.equal(null);
        room.enter(players[2]);
        expect(room.viewFor(players[2])).to.deep.equal({
            params,
            sitting: [players[0], players[1], null, null],
            standing: [players[2]],
            round: {
                myPlayerState: null,
                otherPlayerStates: [
                    {
                        index: 0,
                        playerId: 0,
                        balance: STARTING_BALANCE - params.anteBet -
                                     params.smallBlindBet,
                        hasFolded: false,
                        maxStakes: STARTING_BALANCE,
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
                    ],
                }],
                didLastRaiseIndex: 1,
                isFinished: false,
            }
        });
    });
});
