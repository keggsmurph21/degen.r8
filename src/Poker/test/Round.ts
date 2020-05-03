import "mocha";

import {expect} from "chai";

import {Card, Rank, Suit} from "../Card";
import {Player} from "../Player";
import {Bet, getWinners, Round} from "../Round";

const MINIMUM_BET = 1.00;
const params = {
    minimumBet: MINIMUM_BET,
    useBlinds: true,
    bigBlindBet: MINIMUM_BET,
    smallBlindBet: MINIMUM_BET / 2,
    useAntes: true,
    anteBet: MINIMUM_BET / 2,
};

const p0 = new Player();
const p1 = new Player();
const p2 = new Player();
const p3 = new Player();

expect(p0.getBalance()).to.equal(20);
expect(p1.getBalance()).to.equal(20);
expect(p2.getBalance()).to.equal(20);
expect(p3.getBalance()).to.equal(20);

describe("Round", () => {
    describe("make bets", () => {
        it("track everyone folding", () => {
            const round = new Round([p0, p1, p2, p3], params);
            expect(round.getPot())
                .to.equal(4 * params.anteBet + params.smallBlindBet +
                          params.bigBlindBet);
            expect(p0.getBalance()).to.equal(20 - params.anteBet);
            expect(p1.getBalance())
                .to.equal(20 - params.anteBet - params.smallBlindBet);
            expect(p2.getBalance())
                .to.equal(20 - params.anteBet - params.bigBlindBet);
            expect(p3.getBalance()).to.equal(20 - params.anteBet);
            round.makeBet(p3, Bet.Fold);
            round.makeBet(p0, Bet.Fold);
            round.makeBet(p1, Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(p2.getBalance()).to.equal(22);
            expect(p3.getBalance()).to.equal(19.5);
            expect(p0.getBalance()).to.equal(19.5);
            expect(p1.getBalance()).to.equal(19);
        });

        it("track everyone calling & folding", () => {
            const round = new Round([p1, p2, p3, p0], params);
            expect(p1.getBalance()).to.equal(19 - params.anteBet);
            expect(p2.getBalance())
                .to.equal(22 - params.anteBet - params.smallBlindBet);
            expect(p3.getBalance())
                .to.equal(19.5 - params.anteBet - params.bigBlindBet);
            expect(p0.getBalance()).to.equal(19.5 - params.anteBet);
            round.makeBet(p0, Bet.Call);
            expect(p0.getBalance()).to.equal(18);
            expect(round.getPot()).to.equal(4.5);
            round.makeBet(p1, Bet.Call);
            expect(p1.getBalance()).to.equal(17.5);
            expect(round.getPot()).to.equal(5.5);
            round.makeBet(p2, Bet.Call);
            expect(p2.getBalance()).to.equal(20.5);
            expect(round.getPot()).to.equal(6);
            round.makeBet(p3, Bet.Call);
            expect(p3.getBalance()).to.equal(18);
            expect(round.getPot()).to.equal(6);
            expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(p0, Bet.Fold);
            round.makeBet(p1, Bet.Fold);
            round.makeBet(p2, Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(p3.getBalance()).to.equal(24);
            expect(p0.getBalance()).to.equal(18);
            expect(p1.getBalance()).to.equal(17.5);
            expect(p2.getBalance()).to.equal(20.5);
        });

        it("track everyone calling & calling & folding", () => {
            const round = new Round([p2, p3, p0, p1], params);
            expect(p2.getBalance()).to.equal(20.5 - params.anteBet);
            expect(p3.getBalance())
                .to.equal(24 - params.anteBet - params.smallBlindBet);
            expect(p0.getBalance())
                .to.equal(18 - params.anteBet - params.bigBlindBet);
            expect(p1.getBalance()).to.equal(17.5 - params.anteBet);
            round.makeBet(p1, Bet.Call);
            expect(p1.getBalance()).to.equal(16);
            round.makeBet(p2, Bet.Call);
            expect(p2.getBalance()).to.equal(19);
            round.makeBet(p3, Bet.Call);
            expect(p3.getBalance()).to.equal(22.5);
            round.makeBet(p0, Bet.Call);
            expect(p0.getBalance()).to.equal(16.5);
            expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(p1, Bet.Call);
            expect(p1.getBalance()).to.equal(16)
            round.makeBet(p2, Bet.Call);
            expect(p2.getBalance()).to.equal(19);
            round.makeBet(p3, Bet.Call);
            expect(p3.getBalance()).to.equal(22.5);
            round.makeBet(p0, Bet.Call);
            expect(p0.getBalance()).to.equal(16.5);
            expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(p1, Bet.Fold);
            round.makeBet(p2, Bet.Fold);
            round.makeBet(p3, Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(p0.getBalance()).to.equal(22.5);
            expect(p1.getBalance()).to.equal(16);
            expect(p2.getBalance()).to.equal(19);
            expect(p3.getBalance()).to.equal(22.5);
        });

        it("track everyone calling & calling & calling & folding", () => {
            const round = new Round([p3, p0, p1, p2], params);
            expect(p3.getBalance()).to.equal(22.5 - params.anteBet);
            expect(p0.getBalance())
                .to.equal(22.5 - params.anteBet - params.smallBlindBet);
            expect(p1.getBalance())
                .to.equal(16 - params.anteBet - params.bigBlindBet);
            expect(p2.getBalance()).to.equal(19 - params.anteBet);
            round.makeBet(p2, Bet.Call);
            expect(p2.getBalance()).to.equal(17.5);
            round.makeBet(p3, Bet.Call);
            expect(p3.getBalance()).to.equal(21);
            round.makeBet(p0, Bet.Call);
            expect(p0.getBalance()).to.equal(21);
            round.makeBet(p1, Bet.Call);
            expect(p1.getBalance()).to.equal(14.5);
            expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(p2, Bet.Call);
            round.makeBet(p3, Bet.Call);
            round.makeBet(p0, Bet.Call);
            round.makeBet(p1, Bet.Call);
            expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(p2, Bet.Call);
            round.makeBet(p3, Bet.Call);
            round.makeBet(p0, Bet.Call);
            round.makeBet(p1, Bet.Call);
            expect(round.getCommunityCards().length).to.equal(5);
            round.makeBet(p2, Bet.Fold);
            round.makeBet(p3, Bet.Fold);
            round.makeBet(p0, Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(p1.getBalance()).to.equal(20.5);
            expect(p2.getBalance()).to.equal(17.5);
            expect(p3.getBalance()).to.equal(21);
            expect(p0.getBalance()).to.equal(21);
        });

        it("track everyone calling / folding", () => {
            const round = new Round([p0, p1, p2, p3], params);
            expect(p0.getBalance()).to.equal(21 - params.anteBet);
            expect(p1.getBalance())
                .to.equal(20.5 - params.anteBet - params.smallBlindBet);
            expect(p2.getBalance())
                .to.equal(17.5 - params.anteBet - params.bigBlindBet);
            expect(p3.getBalance()).to.equal(21 - params.anteBet);
            round.makeBet(p3, Bet.Fold);
            round.makeBet(p0, Bet.Fold);
            round.makeBet(p1, Bet.Call);
            expect(p1.getBalance()).to.equal(19);
            round.makeBet(p2, Bet.Call);
            expect(p2.getBalance()).to.equal(16);
            expect(round.getPot()).to.equal(4);
            expect(round.getCommunityCards().length).to.equal(3);
            round.makeBet(p1, Bet.Fold);
            expect(round.isFinished).to.be.true;
            expect(p0.getBalance()).to.equal(20.5);
            expect(p1.getBalance()).to.equal(19);
            expect(p2.getBalance()).to.equal(20);
            expect(p3.getBalance()).to.equal(20.5);
        });

        it("track everyone raising", () => {
            const round = new Round([p1, p2, p3, p0], params);
            expect(p1.getBalance()).to.equal(19 - params.anteBet);
            expect(p2.getBalance())
                .to.equal(20 - params.anteBet - params.smallBlindBet);
            expect(p3.getBalance())
                .to.equal(20.5 - params.anteBet - params.bigBlindBet);
            expect(p0.getBalance()).to.equal(20.5 - params.anteBet);
            expect(() => round.makeBet(p0, Bet.Raise, -1)).to.throw();
            expect(() => round.makeBet(p0, Bet.Raise, 1)).to.throw();
            round.makeBet(p0, Bet.Raise, 1.5);
            expect(() => round.makeBet(p1, Bet.Raise, 1.5)).to.throw();
            round.makeBet(p1, Bet.Raise, 2);
            expect(() => round.makeBet(p2, Bet.Raise, 1.5)).to.throw();
            round.makeBet(p2, Bet.Raise, 2);
            round.makeBet(p3, Bet.Call);
            round.makeBet(p0, Bet.Call);
            round.makeBet(p1, Bet.Call);
            expect(round.getCommunityCards().length).to.equal(3);
            expect(round.getPot())
                .to.equal((params.anteBet + params.smallBlindBet + 2) * 4);
            round.makeBet(p2, Bet.Call);
            round.makeBet(p3, Bet.Call);
            round.makeBet(p0, Bet.Raise, 0.5);
            round.makeBet(p1, Bet.Call);
            round.makeBet(p2, Bet.Call);
            round.makeBet(p3, Bet.Call);
            expect(round.getPot())
                .to.equal((params.anteBet + params.smallBlindBet + 2.5) * 4);
            expect(round.getCommunityCards().length).to.equal(4);
            round.makeBet(p0, Bet.Raise, 0.5);
            round.makeBet(p1, Bet.Call);
            round.makeBet(p2, Bet.Call);
            round.makeBet(p3, Bet.Raise, 1);
            expect(round.getPot())
                .to.equal((params.anteBet + params.smallBlindBet + 2.5) * 4 +
                          2.5);
            round.makeBet(p0, Bet.Fold);
            round.makeBet(p1, Bet.Fold);
            round.makeBet(p2, Bet.Fold);
            expect(p1.getBalance()).to.equal(15);
            expect(p2.getBalance()).to.equal(16);
            expect(p3.getBalance()).to.equal(32.5);
            expect(p0.getBalance()).to.equal(16.5);
        });
    });

    describe("get winners", () => {
        const getPlayerState = (holeCards: [Card, Card]) => {
            return {
                player: new Player(),
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
