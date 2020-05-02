import "mocha";
import { expect } from "chai";

import { HandType, getBestFiveCardHand, SevenCards } from "../Hand";
import { Rank, Suit } from "../Card";

const expectHand = (cards: SevenCards, handType: HandType, highestRanks: Rank[] = []) => {
    const bestHand = getBestFiveCardHand(cards);
    expect(bestHand.type).to.equal(handType);
    highestRanks.forEach((rank , i) => {
        expect(bestHand.ranks[4 - i]).to.equal(rank);
    });
};

describe("Hand", () => {

    it("calculate BestHands", () => {

        expectHand([
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Four },
            { suit: Suit.Hearts, rank: Rank.Five },
            { suit: Suit.Hearts, rank: Rank.Six },
            { suit: Suit.Hearts, rank: Rank.Seven },
            { suit: Suit.Hearts, rank: Rank.Eight },
        ], HandType.StraightFlush);

        expectHand([
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Four },
            { suit: Suit.Hearts, rank: Rank.Six },
            { suit: Suit.Hearts, rank: Rank.Seven },
            { suit: Suit.Hearts, rank: Rank.Eight },
            { suit: Suit.Hearts, rank: Rank.Ten },
        ], HandType.Flush);

        expectHand([
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Four },
            { suit: Suit.Clubs, rank: Rank.Five },
            { suit: Suit.Clubs, rank: Rank.Seven },
            { suit: Suit.Clubs, rank: Rank.Eight },
            { suit: Suit.Clubs, rank: Rank.Ten },
        ], HandType.HighCard);

        expectHand([
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Four },
            { suit: Suit.Clubs, rank: Rank.Five },
            { suit: Suit.Clubs, rank: Rank.Six },
            { suit: Suit.Clubs, rank: Rank.Eight },
            { suit: Suit.Clubs, rank: Rank.Nine },
        ], HandType.Straight, [Rank.Six]);

        expectHand([
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Six },
            { suit: Suit.Hearts, rank: Rank.Seven },
            { suit: Suit.Hearts, rank: Rank.Eight },
            { suit: Suit.Hearts, rank: Rank.Nine },
            { suit: Suit.Hearts, rank: Rank.Ten },
        ], HandType.StraightFlush, [Rank.Ten]);

        expectHand([
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Ten },
            { suit: Suit.Hearts, rank: Rank.Jack },
            { suit: Suit.Hearts, rank: Rank.Queen },
            { suit: Suit.Hearts, rank: Rank.King },
            { suit: Suit.Hearts, rank: Rank.Ace },
        ], HandType.RoyalFlush);

        expectHand([
            { suit: Suit.Clubs, rank: Rank.Two },
            { suit: Suit.Diamonds, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Spades, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Queen },
            { suit: Suit.Hearts, rank: Rank.King },
            { suit: Suit.Hearts, rank: Rank.Ace },
        ], HandType.FourOfAKind, [Rank.Ace, Rank.Two]);

        expectHand([
            { suit: Suit.Clubs, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Two },
            { suit: Suit.Clubs, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Spades, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.King },
            { suit: Suit.Hearts, rank: Rank.Ace },
        ], HandType.FullHouse, [Rank.Three]);

        expectHand([
            { suit: Suit.Clubs, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Spades, rank: Rank.Three },
            { suit: Suit.Clubs, rank: Rank.Ten },
            { suit: Suit.Hearts, rank: Rank.Jack },
            { suit: Suit.Hearts, rank: Rank.King },
            { suit: Suit.Hearts, rank: Rank.Ace },
        ], HandType.ThreeOfAKind, [Rank.Ace, Rank.King, Rank.Three]);

        expectHand([
            { suit: Suit.Clubs, rank: Rank.Three },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Spades, rank: Rank.Ten },
            { suit: Suit.Clubs, rank: Rank.Ten },
            { suit: Suit.Hearts, rank: Rank.Jack },
            { suit: Suit.Hearts, rank: Rank.King },
            { suit: Suit.Hearts, rank: Rank.Ace },
        ], HandType.TwoPair, [Rank.Ace, Rank.Ten, Rank.Ten, Rank.Three]);

        expectHand([
            { suit: Suit.Clubs, rank: Rank.Two },
            { suit: Suit.Hearts, rank: Rank.Three },
            { suit: Suit.Spades, rank: Rank.Four },
            { suit: Suit.Clubs, rank: Rank.Ten },
            { suit: Suit.Hearts, rank: Rank.Jack },
            { suit: Suit.Hearts, rank: Rank.King },
            { suit: Suit.Hearts, rank: Rank.Ace },
        ], HandType.HighCard, [Rank.Ace, Rank.King, Rank.Jack, Rank.Ten, Rank.Four]);

    });
});
