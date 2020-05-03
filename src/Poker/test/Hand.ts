import "mocha";

import {expect} from "chai";

import {Rank, Suit} from "../Card";
import {compareHands, getBestFiveCardHand, HandType, SevenCards} from "../Hand";

describe("Hand", () => {
    describe("calculate best hands", () => {
        const expectHand = (cards: SevenCards, handType: HandType,
                            highestRanks: Rank[] = []) => {
            const bestHand = getBestFiveCardHand(cards);
            expect(bestHand.type).to.equal(handType);
            highestRanks.forEach(
                (rank, i) => { expect(bestHand.ranks[i]).to.equal(rank); });
        };

        it("RoyalFlush", () => {
            expectHand(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.Queen},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.RoyalFlush);
        });

        it("StraightFlush", () => {
            expectHand(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Hearts, rank: Rank.Five},
                    {suit: Suit.Hearts, rank: Rank.Six},
                    {suit: Suit.Hearts, rank: Rank.Seven},
                    {suit: Suit.Hearts, rank: Rank.Eight},
                ],
                HandType.StraightFlush, [Rank.Eight]);
            expectHand(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Six},
                    {suit: Suit.Hearts, rank: Rank.Seven},
                    {suit: Suit.Hearts, rank: Rank.Eight},
                    {suit: Suit.Hearts, rank: Rank.Nine},
                    {suit: Suit.Hearts, rank: Rank.Ten},
                ],
                HandType.StraightFlush, [Rank.Ten]);
        });

        it("FourOfAKind", () => {
            expectHand(
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Queen},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.FourOfAKind, [Rank.Ace, Rank.Two]);
        });

        it("FullHouse", () => {
            expectHand(
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.FullHouse, [Rank.Three]);
        });

        it("Flush", () => {
            expectHand(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Hearts, rank: Rank.Six},
                    {suit: Suit.Hearts, rank: Rank.Seven},
                    {suit: Suit.Hearts, rank: Rank.Eight},
                    {suit: Suit.Hearts, rank: Rank.Ten},
                ],
                HandType.Flush);
        });

        it("Straight", () => {
            expectHand(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Clubs, rank: Rank.Five},
                    {suit: Suit.Clubs, rank: Rank.Six},
                    {suit: Suit.Clubs, rank: Rank.Eight},
                    {suit: Suit.Clubs, rank: Rank.Nine},
                ],
                HandType.Straight, [Rank.Six]);
        });

        it("ThreeOfAKind", () => {
            expectHand(
                [
                    {suit: Suit.Clubs, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Three},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.ThreeOfAKind, [Rank.Ace, Rank.King, Rank.Three]);
        });

        it("TwoPair", () => {
            expectHand(
                [
                    {suit: Suit.Clubs, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Ten},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.TwoPair, [Rank.Ace, Rank.Ten, Rank.Ten, Rank.Three]);
        });

        it("Pair", () => {
            expectHand(
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Three},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.Pair,
                [Rank.Ace, Rank.King, Rank.Jack, Rank.Two, Rank.Two]);
        });

        it("HighCard", () => {
            expectHand(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Clubs, rank: Rank.Five},
                    {suit: Suit.Clubs, rank: Rank.Seven},
                    {suit: Suit.Clubs, rank: Rank.Eight},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                ],
                HandType.HighCard,
                [Rank.Ten, Rank.Eight, Rank.Seven, Rank.Five, Rank.Four]);
            expectHand(
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Four},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                HandType.HighCard,
                [Rank.Ace, Rank.King, Rank.Jack, Rank.Ten, Rank.Four]);
        });
    });

    describe("compare best hands", () => {
        const expectCompareHands =
            (c0: SevenCards, c1: SevenCards, expectedOrdering: number) => {
                const h0 = getBestFiveCardHand(c0);
                const h1 = getBestFiveCardHand(c1);
                const actualOrdering = compareHands(h0, h1);
                if (expectedOrdering < 0) {
                    expect(actualOrdering).to.be.lessThan(0);
                } else if (expectedOrdering > 0) {
                    expect(actualOrdering).to.be.greaterThan(0);
                } else {
                    expect(actualOrdering).to.equal(0);
                }
            };

        it("when the hand type is different", () => {
            // StraightFlush > Flush
            expectCompareHands(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Hearts, rank: Rank.Five},
                    {suit: Suit.Hearts, rank: Rank.Six},
                    {suit: Suit.Hearts, rank: Rank.Seven},
                    {suit: Suit.Hearts, rank: Rank.Eight},
                ],
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Hearts, rank: Rank.Six},
                    {suit: Suit.Hearts, rank: Rank.Seven},
                    {suit: Suit.Hearts, rank: Rank.Eight},
                    {suit: Suit.Hearts, rank: Rank.Ten},
                ],
                1);

            // HighCard < Straight
            expectCompareHands(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Clubs, rank: Rank.Five},
                    {suit: Suit.Clubs, rank: Rank.Seven},
                    {suit: Suit.Clubs, rank: Rank.Eight},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                ],
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Four},
                    {suit: Suit.Clubs, rank: Rank.Five},
                    {suit: Suit.Clubs, rank: Rank.Six},
                    {suit: Suit.Clubs, rank: Rank.Eight},
                    {suit: Suit.Clubs, rank: Rank.Nine},
                ],
                -1);

            // StraightFlush < RoyalFlush
            expectCompareHands(
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Six},
                    {suit: Suit.Hearts, rank: Rank.Seven},
                    {suit: Suit.Hearts, rank: Rank.Eight},
                    {suit: Suit.Hearts, rank: Rank.Nine},
                    {suit: Suit.Hearts, rank: Rank.Ten},
                ],
                [
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.Queen},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                -1);

            // FourOfAKind > FullHouse
            expectCompareHands(
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Diamonds, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Spades, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Queen},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Two},
                    {suit: Suit.Clubs, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                1);

            // ThreeOfAKind > TwoPair
            expectCompareHands(
                [
                    {suit: Suit.Clubs, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Three},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                [
                    {suit: Suit.Clubs, rank: Rank.Three},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Ten},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                1);

            // Pair > HighCard
            expectCompareHands(
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Ten},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                [
                    {suit: Suit.Clubs, rank: Rank.Two},
                    {suit: Suit.Hearts, rank: Rank.Three},
                    {suit: Suit.Spades, rank: Rank.Four},
                    {suit: Suit.Clubs, rank: Rank.Ten},
                    {suit: Suit.Hearts, rank: Rank.Jack},
                    {suit: Suit.Hearts, rank: Rank.King},
                    {suit: Suit.Hearts, rank: Rank.Ace},
                ],
                1);
        });
        describe("when the hand type is the same", () => {
            it("RoyalFlush", () => {
                // this isn't actually possible :^)
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Jack},
                        {suit: Suit.Clubs, rank: Rank.Queen},
                        {suit: Suit.Clubs, rank: Rank.King},
                        {suit: Suit.Clubs, rank: Rank.Ace},
                    ],
                    0);
            });

            it("StraightFlush", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                    ],
                    -1);
            });

            it("FourOfAKind", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Diamonds, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Queen},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Diamonds, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Six},
                    ],
                    -1);
            });

            it("FullHouse", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Diamonds, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
            });

            it("Flush", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Ten},
                    ],
                    -1);
            });

            it("Straight", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Six},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Nine},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Six},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Nine},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Six},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Six},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Nine},
                    ],
                    -1);
            });

            it("ThreeOfAKind", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Two},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Three},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
            });

            it("TwoPair", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Hearts, rank: Rank.Five},
                        {suit: Suit.Hearts, rank: Rank.Six},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Nine},
                        {suit: Suit.Clubs, rank: Rank.Nine},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Nine},
                        {suit: Suit.Clubs, rank: Rank.Nine},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
            });

            it("Pair", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Nine},
                        {suit: Suit.Clubs, rank: Rank.Nine},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Nine},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    [
                        {suit: Suit.Clubs, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Spades, rank: Rank.Ten},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                        {suit: Suit.Hearts, rank: Rank.Jack},
                        {suit: Suit.Hearts, rank: Rank.King},
                        {suit: Suit.Hearts, rank: Rank.Ace},
                    ],
                    -1);
            });

            it("HighCard", () => {
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                    ],
                    0);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Six},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Ten},
                    ],
                    -1);
                expectCompareHands(
                    [
                        {suit: Suit.Hearts, rank: Rank.Six},
                        {suit: Suit.Hearts, rank: Rank.Seven},
                        {suit: Suit.Hearts, rank: Rank.Eight},
                        {suit: Suit.Hearts, rank: Rank.Nine},
                        {suit: Suit.Clubs, rank: Rank.Jack},
                        {suit: Suit.Clubs, rank: Rank.Queen},
                        {suit: Suit.Clubs, rank: Rank.King},
                    ],
                    [
                        {suit: Suit.Hearts, rank: Rank.Two},
                        {suit: Suit.Hearts, rank: Rank.Three},
                        {suit: Suit.Hearts, rank: Rank.Four},
                        {suit: Suit.Clubs, rank: Rank.Five},
                        {suit: Suit.Clubs, rank: Rank.Seven},
                        {suit: Suit.Clubs, rank: Rank.Eight},
                        {suit: Suit.Clubs, rank: Rank.Ace},
                    ],
                    -1);
            });
        });
    });
});
