import "mocha";

import {expect} from "chai";

import {Card, Rank, Suit} from "../Card";
import {Bet, getWinners, Round} from "../Round";

const MINIMUM_BET = 1.00;
const STARTING_BALANCE = 20.00;
const params = {
    minimumBet: MINIMUM_BET,
    useBlinds: true,
    bigBlindBet: MINIMUM_BET,
    smallBlindBet: MINIMUM_BET / 2,
    useAntes: true,
    anteBet: MINIMUM_BET / 2,
};

describe("Round", () => {
    describe("make bets", () => {
        const getPlayers = num => {
            let players = [];
            for (let i = 0; i < num; ++i)
                players.push({balance: STARTING_BALANCE});
            return players;
        };

        it("blinds", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            expect(round.getPot())
                .to.equal(4 * params.anteBet + params.smallBlindBet +
                          params.bigBlindBet);
            expect(players[0].balance)
                .to.equal(STARTING_BALANCE - params.anteBet);
            expect(players[1].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.smallBlindBet);
            expect(players[2].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[3].balance)
                .to.equal(STARTING_BALANCE - params.anteBet);
        });

        it("everyone folding after blinds", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            round.makeBet(players[3], Bet.Fold);
            round.makeBet(players[0], Bet.Fold);
            round.makeBet(players[1], Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(round.getPot()).to.equal(0);
            expect(players[0].balance)
                .to.equal(STARTING_BALANCE - params.anteBet);
            expect(players[1].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.smallBlindBet);
            expect(players[2].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet + 4 * params.anteBet +
                          params.smallBlindBet + params.bigBlindBet);
            expect(players[3].balance)
                .to.equal(STARTING_BALANCE - params.anteBet);
        });

        it("everyone calling first round, then folding", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            round.makeBet(players[3], Bet.Call);
            round.makeBet(players[0], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(0);
            round.makeBet(players[1], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Fold);
            round.makeBet(players[0], Bet.Fold);
            round.makeBet(players[1], Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(players[0].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[1].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[2].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet + 4 * params.anteBet +
                          4 * params.bigBlindBet);
            expect(players[3].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
        });

        it("everyone calling first two rounds, then folding", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            round.makeBet(players[3], Bet.Call);
            round.makeBet(players[0], Bet.Call);
            round.makeBet(players[1], Bet.Call);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Call);
            round.makeBet(players[0], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(players[1], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Fold);
            round.makeBet(players[0], Bet.Fold);
            round.makeBet(players[1], Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(players[0].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[1].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[2].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet + 4 * params.anteBet +
                          4 * params.bigBlindBet);
            expect(players[3].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
        });

        it("everyone calling first three rounds, then folding", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            round.makeBet(players[3], Bet.Call);
            round.makeBet(players[0], Bet.Call);
            round.makeBet(players[1], Bet.Call);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Call);
            round.makeBet(players[0], Bet.Call);
            round.makeBet(players[1], Bet.Call);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Call);
            round.makeBet(players[0], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(players[1], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(5);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Fold);
            round.makeBet(players[0], Bet.Fold);
            round.makeBet(players[1], Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(players[0].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[1].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[2].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet + 4 * params.anteBet +
                          4 * params.bigBlindBet);
            expect(players[3].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
        });

        it("two players folding, small blind calling then folding", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            round.makeBet(players[3], Bet.Fold);
            round.makeBet(players[0], Bet.Fold);
            round.makeBet(players[1], Bet.Call);
            round.makeBet(players[2], Bet.Call);
            expect(round.getPot())
                .to.equal(4 * params.anteBet + 2 * params.bigBlindBet);
            round.makeBet(players[1], Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(players[0].balance)
                .to.equal(STARTING_BALANCE - params.anteBet);
            expect(players[1].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet);
            expect(players[2].balance)
                .to.equal(STARTING_BALANCE - params.anteBet -
                          params.bigBlindBet + 4 * params.anteBet +
                          2 * params.bigBlindBet);
            expect(players[3].balance)
                .to.equal(STARTING_BALANCE - params.anteBet);
        });

        it("one player raising", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            let currentBet = params.bigBlindBet;
            let raiseBy = 0.01;
            expect(round.getCurrentBet()).to.equal(currentBet);
            expect(() => round.makeBet(players[3], Bet.Raise, -1)).to.throw();
            expect(() => round.makeBet(players[3], Bet.Raise, 0)).to.throw();
            expect(() => round.makeBet(players[3], Bet.Raise, STARTING_BALANCE))
                .to.throw();
            round.makeBet(players[3], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getCurrentBet()).to.equal(currentBet);
        });

        it("three players raising", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            let currentBet = params.bigBlindBet;
            let raiseBy = 0.5;
            // p3 raises
            round.makeBet(players[3], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getCurrentBet()).to.equal(currentBet);
            // p0 raises
            round.makeBet(players[0], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getCurrentBet()).to.equal(currentBet);
            // p1 raises
            round.makeBet(players[1], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getCurrentBet()).to.equal(currentBet);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(0);
            round.makeBet(players[0], Bet.Call);
            players.forEach(p => expect(p.balance).to.equal(STARTING_BALANCE -
                                                            params.anteBet -
                                                            currentBet));
            expect(round.getCommunityCards().length).to.equal(3);
            expect(round.getPot()).to.equal(4 * (params.anteBet + currentBet));
        });
    });

    describe("get winners", () => {
        const getPlayerState = (holeCards: [Card, Card]) => {
            return {
                player: {balance: STARTING_BALANCE},
                hasFolded: false,
                holeCards,
                amountBetThisRound: 1.0,
            };
        };
        const communityCards = [
            {suit: Suit.Diamonds, rank: Rank.Five},
            {suit: Suit.Diamonds, rank: Rank.Six},
            {suit: Suit.Diamonds, rank: Rank.Seven},
            {suit: Suit.Diamonds, rank: Rank.Eight},
            {suit: Suit.Clubs, rank: Rank.Ten},
        ];

        it("one player", () => {
            const ps0 = getPlayerState([
                {suit: Suit.Hearts, rank: Rank.Two},
                {suit: Suit.Hearts, rank: Rank.Three}
            ]);
            expect(getWinners([ps0], communityCards)).to.deep.equal([
                ps0.player
            ]);
        });

        describe("two players", () => {
            it("tie", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Three},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps0.player,
                    ps1.player,
                ]);
            });
            it("tie", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Ace}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Ace},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps0.player,
                    ps1.player,
                ]);
            });
            it("flush > straight", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Four},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps0.player,
                ]);
            });
            it("flush & high card", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Nine},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps1.player,
                ]);
            });
        });

        describe("three players", () => {
            it("three-way tie", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Three},
                ]);
                const ps2 = getPlayerState([
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Three},
                ]);
                expect(getWinners([ps0, ps1, ps2], communityCards))
                    .to.deep.equal([
                        ps0.player,
                        ps1.player,
                        ps2.player,
                    ]);
            });
            it("three-way tie", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Ace}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Ace},
                ]);
                const ps2 = getPlayerState([
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Ace},
                ]);
                expect(getWinners([ps0, ps1, ps2], communityCards))
                    .to.deep.equal([
                        ps0.player,
                        ps1.player,
                        ps2.player,
                    ]);
            });
            it("two-way tie", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Ace}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Ace},
                ]);
                const ps2 = getPlayerState([
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Three},
                ]);
                expect(getWinners([ps0, ps1, ps2], communityCards))
                    .to.deep.equal([
                        ps0.player,
                        ps1.player,
                    ]);
            });
            it("flush > straight", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Four},
                ]);
                const ps2 = getPlayerState([
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Four}
                ]);
                expect(getWinners([ps0, ps1, ps2], communityCards))
                    .to.deep.equal([
                        ps0.player,
                    ]);
            });
            it("straight & high card", () => {
                const ps0 = getPlayerState([
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Four}
                ]);
                const ps1 = getPlayerState([
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Nine},
                ]);
                const ps2 = getPlayerState([
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Nine},
                ]);
                expect(getWinners([ps0, ps1, ps2], communityCards))
                    .to.deep.equal([
                        ps1.player,
                        ps2.player,
                    ]);
            });
        });
    });
});
