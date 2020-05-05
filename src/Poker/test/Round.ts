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
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet, params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet, params.anteBet
                ],
            }]);
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
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet, params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet, params.anteBet
                ],
            }]);
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
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet, params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet
                ],
            }]);
            round.makeBet(players[0], Bet.Call);
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet
                ],
            }]);
            expect(round.getCommunityCards().length).to.equal(0);
            round.makeBet(players[1], Bet.Call);
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet
                ],
            }]);
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
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet
                ],
            }]);
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
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet,
                contributions: [
                    params.anteBet, params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet, params.anteBet
                ],
            }]);
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
            let currentBet = params.anteBet + params.bigBlindBet;
            let raiseBy = 0.01;
            expect(round.getCurrentBet()).to.equal(currentBet);
            expect(() => round.makeBet(players[3], Bet.Raise, -1)).to.throw();
            expect(() => round.makeBet(players[3], Bet.Raise, 0)).to.throw();
            expect(() => round.makeBet(players[3], Bet.Raise, STARTING_BALANCE))
                .to.throw();
            round.makeBet(players[3], Bet.Raise, raiseBy);
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet + raiseBy,
                contributions: [
                    params.anteBet,
                    params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet + raiseBy,
                ],
            }]);
            currentBet += raiseBy;
            expect(round.getCurrentBet()).to.equal(currentBet);
        });

        it("three players raising", () => {
            const players = getPlayers(4);
            const round = new Round(players, params);
            let currentBet = params.anteBet + params.bigBlindBet;
            let raiseBy = 0.5;
            // p3 raises
            round.makeBet(players[3], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet + raiseBy,
                contributions: [
                    params.anteBet,
                    params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet + raiseBy,
                ],
            }]);
            expect(round.getCurrentBet()).to.equal(currentBet);
            // p0 raises
            round.makeBet(players[0], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getCurrentBet()).to.equal(currentBet);
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet + 2 * raiseBy,
                contributions: [
                    params.anteBet + params.bigBlindBet + 2 * raiseBy,
                    params.anteBet + params.smallBlindBet,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet + raiseBy,
                ],
            }]);
            // p1 raises
            round.makeBet(players[1], Bet.Raise, raiseBy);
            currentBet += raiseBy;
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet + 3 * raiseBy,
                contributions: [
                    params.anteBet + params.bigBlindBet + 2 * raiseBy,
                    params.anteBet + params.bigBlindBet + 3 * raiseBy,
                    params.anteBet + params.bigBlindBet,
                    params.anteBet + params.bigBlindBet + raiseBy,
                ],
            }]);
            expect(round.getCurrentBet()).to.equal(currentBet);
            round.makeBet(players[2], Bet.Call);
            round.makeBet(players[3], Bet.Call);
            expect(round.getCommunityCards().length).to.equal(0);
            round.makeBet(players[0], Bet.Call);
            expect(round.getPots()).to.deep.equal([{
                maxCumulativeBet: STARTING_BALANCE,
                maxMarginalBet: STARTING_BALANCE,
                marginalBet: params.anteBet + params.bigBlindBet + 3 * raiseBy,
                contributions: [
                    params.anteBet + params.bigBlindBet + 3 * raiseBy,
                    params.anteBet + params.bigBlindBet + 3 * raiseBy,
                    params.anteBet + params.bigBlindBet + 3 * raiseBy,
                    params.anteBet + params.bigBlindBet + 3 * raiseBy,
                ],
            }]);
            players.forEach(
                p => expect(p.balance).to.equal(STARTING_BALANCE - currentBet));
            expect(round.getCommunityCards().length).to.equal(3);
            expect(round.getPot()).to.equal(4 * currentBet);
        });

        it("raising by an amount no one can afford", () => {
            const players = getPlayers(4);
            players[3].balance = 3 * STARTING_BALANCE;
            const round = new Round(players, params);
            expect(() => round.makeBet(players[3], Bet.Raise, STARTING_BALANCE))
                .to.throw();
        });

        describe("side pots", () => {
            it("normal betting", () => {
                const players = getPlayers(4);
                const round = new Round(players, params);
                let currentBet = params.anteBet + params.bigBlindBet;
                let raiseBy = 0.5;
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: currentBet,
                    contributions: [
                        params.anteBet, params.anteBet + params.smallBlindBet,
                        params.anteBet + params.bigBlindBet, params.anteBet
                    ],
                }]);
                round.makeBet(players[3], Bet.Raise, raiseBy);
                currentBet += raiseBy;
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: currentBet,
                    contributions: [
                        params.anteBet, params.anteBet + params.smallBlindBet,
                        params.anteBet + params.bigBlindBet,
                        params.anteBet + params.bigBlindBet + raiseBy
                    ],
                }]);
                round.makeBet(players[0], Bet.Raise, raiseBy);
                currentBet += raiseBy;
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: currentBet,
                    contributions: [
                        params.anteBet + params.bigBlindBet + 2 * raiseBy,
                        params.anteBet + params.smallBlindBet,
                        params.anteBet + params.bigBlindBet,
                        params.anteBet + params.bigBlindBet + raiseBy
                    ],
                }]);
                round.makeBet(players[1], Bet.Raise, raiseBy);
                currentBet += raiseBy;
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: currentBet,
                    contributions: [
                        params.anteBet + params.bigBlindBet + 2 * raiseBy,
                        params.anteBet + params.bigBlindBet + 3 * raiseBy,
                        params.anteBet + params.bigBlindBet,
                        params.anteBet + params.bigBlindBet + raiseBy
                    ],
                }]);
                round.makeBet(players[2], Bet.Call);
                round.makeBet(players[3], Bet.Call);
                round.makeBet(players[0], Bet.Call);
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: currentBet,
                    contributions: [
                        params.anteBet + params.bigBlindBet + 3 * raiseBy,
                        params.anteBet + params.bigBlindBet + 3 * raiseBy,
                        params.anteBet + params.bigBlindBet + 3 * raiseBy,
                        params.anteBet + params.bigBlindBet + 3 * raiseBy,
                    ],
                }]);
            });

            it("go all in", () => {
                const players = getPlayers(3);
                players[0].balance = 2 * STARTING_BALANCE;
                players[1].balance = 2 * STARTING_BALANCE;
                players[2].balance = STARTING_BALANCE;
                const round = new Round(players, params);
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: params.anteBet + params.bigBlindBet,
                    contributions: [
                        params.anteBet, params.anteBet + params.smallBlindBet,
                        params.anteBet + params.bigBlindBet
                    ],
                }]);
                round.makeBet(players[0], Bet.Raise, STARTING_BALANCE);
                expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            params.anteBet + params.smallBlindBet,
                            params.anteBet + params.bigBlindBet
                        ],
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions:
                            [params.anteBet + params.bigBlindBet, 0, 0],
                    }
                ]);
                round.makeBet(players[1], Bet.Call);
                expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE, STARTING_BALANCE,
                            params.anteBet + params.bigBlindBet
                        ],
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.bigBlindBet,
                            params.anteBet + params.bigBlindBet, 0
                        ],
                    }
                ]);
                round.makeBet(players[2], Bet.Call);
                expect(round.getPot())
                    .to.equal(STARTING_BALANCE +
                              2 * (params.anteBet + params.bigBlindBet +
                                   STARTING_BALANCE));
                expect(players[0].balance)
                    .to.equal(2 * STARTING_BALANCE - params.anteBet -
                              params.bigBlindBet - STARTING_BALANCE);
                expect(players[1].balance)
                    .to.equal(2 * STARTING_BALANCE - params.anteBet -
                              params.bigBlindBet - STARTING_BALANCE);
                expect(players[2].balance).to.equal(0);
            });

            it("main pot win", () => {
                const players = getPlayers(3);
                players[0].balance = 2 * STARTING_BALANCE;
                players[1].balance = 2 * STARTING_BALANCE;
                players[2].balance = STARTING_BALANCE;
                const round = new Round(players, params);
                round.makeBet(players[0], Bet.Raise, STARTING_BALANCE);
                round.makeBet(players[1], Bet.Call);
                round.makeBet(players[2], Bet.Call);
                expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                        ],
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.bigBlindBet,
                            params.anteBet + params.bigBlindBet, 0
                        ],
                    }
                ]);
                round.makeBet(players[0], Bet.Call);
                round.makeBet(players[1], Bet.Fold);
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: STARTING_BALANCE,
                    contributions: [
                        STARTING_BALANCE,
                        STARTING_BALANCE,
                        STARTING_BALANCE,
                    ],
                }]);
                // Player 2 has 0 balance, so s/he shouldn't be able to do
                // anything else (including folding).
                expect(() => round.makeBet(players[2], Bet.Fold)).to.throw();
                expect(players[0].balance)
                    .to.equal(STARTING_BALANCE + params.anteBet +
                              params.bigBlindBet);
                expect(players[1].balance)
                    .to.equal(STARTING_BALANCE - params.anteBet -
                              params.bigBlindBet);
                expect(players[2].balance).to.equal(0);
                // FIXME: This isn't actually a "main pot win" yet ...
            });

            it("side pot then fold", () => {
                const players = getPlayers(3);
                players[0].balance = 2 * STARTING_BALANCE;
                players[1].balance = 2 * STARTING_BALANCE;
                players[2].balance = STARTING_BALANCE;
                const round = new Round(players, params);
                round.makeBet(players[0], Bet.Raise, STARTING_BALANCE);
                round.makeBet(players[1], Bet.Call);
                round.makeBet(players[2], Bet.Call);
                expect(round.getPots()).to.deep.equal([
                    {
                        maxCumulativeBet: STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: STARTING_BALANCE,
                        contributions: [
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                            STARTING_BALANCE,
                        ],
                    },
                    {
                        maxCumulativeBet: 2 * STARTING_BALANCE,
                        maxMarginalBet: STARTING_BALANCE,
                        marginalBet: params.anteBet + params.bigBlindBet,
                        contributions: [
                            params.anteBet + params.bigBlindBet,
                            params.anteBet + params.bigBlindBet, 0
                        ],
                    }
                ]);
                expect(players[0].balance)
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE -
                              params.anteBet - params.bigBlindBet);
                expect(players[1].balance)
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE -
                              params.anteBet - params.bigBlindBet);
                expect(players[2].balance).to.equal(0);
                round.makeBet(players[0], Bet.Fold);
                expect(round.getPots()).to.deep.equal([{
                    maxCumulativeBet: STARTING_BALANCE,
                    maxMarginalBet: STARTING_BALANCE,
                    marginalBet: STARTING_BALANCE,
                    contributions: [
                        STARTING_BALANCE,
                        STARTING_BALANCE,
                        STARTING_BALANCE,
                    ],
                }]);
                expect(players[0].balance)
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE -
                              params.anteBet - params.bigBlindBet);
                expect(players[1].balance)
                    .to.equal(2 * STARTING_BALANCE - STARTING_BALANCE +
                              params.anteBet + params.bigBlindBet);
                expect(players[2].balance).to.equal(0);
                round.makeBet(players[1], Bet.Fold);
                expect(players[2].balance).to.equal(3 * STARTING_BALANCE);
            });
        });
    });

    describe("get winners", () => {
        const getPlayerState = (i: number, holeCards: [Card, Card]) => {
            return {
                index: i,
                player: {balance: STARTING_BALANCE},
                maxStakes: STARTING_BALANCE,
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
            const ps0 = getPlayerState(0, [
                {suit: Suit.Hearts, rank: Rank.Two},
                {suit: Suit.Hearts, rank: Rank.Three}
            ]);
            expect(getWinners([ps0], communityCards)).to.deep.equal([
                ps0.player
            ]);
        });

        describe("two players", () => {
            it("tie", () => {
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Three},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps0.player,
                    ps1.player,
                ]);
            });
            it("tie", () => {
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Ace}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Ace},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps0.player,
                    ps1.player,
                ]);
            });
            it("flush > straight", () => {
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Four},
                ]);
                expect(getWinners([ps0, ps1], communityCards)).to.deep.equal([
                    ps0.player,
                ]);
            });
            it("flush & high card", () => {
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState(1, [
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
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Three},
                ]);
                const ps2 = getPlayerState(2, [
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
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Ace}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Ace},
                ]);
                const ps2 = getPlayerState(2, [
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
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Ace}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Ace},
                ]);
                const ps2 = getPlayerState(2, [
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
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Three}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Four},
                ]);
                const ps2 = getPlayerState(2, [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Four}
                ]);
                expect(getWinners([ps0, ps1, ps2], communityCards))
                    .to.deep.equal([
                        ps0.player,
                    ]);
            });
            it("straight & high card", () => {
                const ps0 = getPlayerState(0, [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Four}
                ]);
                const ps1 = getPlayerState(1, [
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Nine},
                ]);
                const ps2 = getPlayerState(2, [
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
