import "mocha";

import {expect} from "chai";

import {getShuffledDeck} from "../Card";
import {MAX_CAPACITY, MIN_CAPACITY, Room} from "../Room";

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
            players.push({balance: STARTING_BALANCE});
        return players;
    };

    it("create", () => {
        expect(() => new Room(getShuffledDeck,
                              {...params, capacity: MIN_CAPACITY - 1}))
            .to.throw();
        expect(() => new Room(getShuffledDeck,
                              {...params, capacity: MIN_CAPACITY + 0.5}))
            .to.throw();
        expect(() => new Room(getShuffledDeck,
                              {...params, capacity: MAX_CAPACITY + 1}))
            .to.throw();
        const room = new Room(getShuffledDeck, params);
        expect(room.getSitting())
            .to.deep.equal({0: null, 1: null, 2: null, 3: null});
        expect(room.getStanding()).to.deep.equal(new Set());
        expect(room.getRound()).to.be.null;
    });

    it("enter room", () => {
        const room = new Room(getShuffledDeck, params);
        const players = getPlayers(2);
        room.enter(players[0]);
        room.enter(players[1]);
        expect(room.getSitting())
            .to.deep.equal({0: null, 1: null, 2: null, 3: null});
        expect(room.getStanding()).to.deep.equal(new Set(players));
        expect(room.getRound()).to.be.null;
        expect(() => room.enter(players[0])).to.throw();
        expect(() => room.enter(players[1])).to.throw();
    });
});
