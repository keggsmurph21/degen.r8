import { Card, forEachRank, forEachSuit, Rank, Suit } from "./Card";

const DEBUG = false;
function debug(...args) {
    if (DEBUG)
        console.log(...args);
}

export enum HandType {
    HighCard,
    Pair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
    RoyalFlush,
};

export type SevenCards = [Card, Card, Card, Card, Card, Card, Card];
type BestHand = {
    readonly type: HandType,
    ranks: Rank[],
};

function extractBestHand(pairs: Rank[], triples: Rank[], quadruples: Rank[],
        highestCards: Card[], straight: Rank[], flushSuit: Suit | null): BestHand {
    const highestRanks = highestCards.map(({ suit, rank }) => rank);
    const isStraight = straight.length >= 5;
    const isFlush = flushSuit !== null;
    straight = straight.slice(-5);
    // Actually determine the best hand
    if (isStraight && isFlush) {
        if (straight[straight.length - 1] === Rank.Ace)
            return { type: HandType.RoyalFlush, ranks: straight };
        return { type: HandType.StraightFlush, ranks: straight };
    }
    if (quadruples.length) {
        const quadruple = quadruples[0]; // there can only be one
        const nonQuadruples = highestRanks.filter(rank => rank !== quadruple);
        const ranks = [quadruple, quadruple, quadruple, quadruple, nonQuadruples.pop()].sort((a, b) => a - b);
        return { type: HandType.FourOfAKind, ranks };
    }
    if (triples.length && pairs.length) {
        const triple = Math.max(...triples);
        const pair = Math.max(...pairs);
        const ranks = [triple, triple, triple, pair, pair].sort((a, b) => a - b);
        return { type: HandType.FullHouse, ranks };
    }
    if (isFlush) {
        const ranks = highestCards
            .filter(({ suit, rank }) => suit === flushSuit)
            .map(({ suit, rank }) => rank)
            .slice(-5);
        return { type: HandType.Flush, ranks };
    }
    if (isStraight)
        return { type: HandType.Straight, ranks: straight };
    if (triples.length) {
        const triple = Math.max(...triples);
        const nonTriples = highestRanks.filter(rank => rank !== triple);
        const ranks = [triple, triple, triple, nonTriples.pop(), nonTriples.pop()].sort((a, b) => a - b);
        return { type: HandType.ThreeOfAKind, ranks };
    }
    if (pairs.length > 1) {
        pairs = pairs.sort((a, b) => a - b);
        const firstPair = pairs.pop();
        const secondPair = pairs.pop();
        const nonPairs = highestRanks.filter(rank => rank !== firstPair && rank !== secondPair);
        const ranks = [firstPair, firstPair, secondPair, secondPair, nonPairs.pop()].sort((a, b) => a - b);
        return { type: HandType.TwoPair, ranks };
    }
    if (pairs.length == 1) {
        const pair = Math.max(...pairs);
        const nonPairs = highestRanks.filter(rank => rank !== pair);
        const ranks = [pair, pair, nonPairs.pop(), nonPairs.pop(), nonPairs.pop()].sort((a, b) => a - b);
        return { type: HandType.Pair, ranks };
    }
    return { type: HandType.HighCard, ranks: highestRanks.slice(-5) };
}

export function getBestFiveCardHand(cards: SevenCards): BestHand {
    debug(cards);
    // make maps of Suit => Rank[] and Rank => Suit[]
    const suits: { [_ in Suit]?: Rank[] } = {};
    const ranks: { [_ in Rank]?: Suit[] } = {};
    cards.forEach(({ suit, rank }) => {
        if (suits[suit] === undefined)
            suits[suit] = [];
        suits[suit].push(rank);
        if (ranks[rank] === undefined)
            ranks[rank] = [];
        ranks[rank].push(suit);
    });
    // iterate over the new data structures, keeping some more
    // state to indicate which thesholds we've hit
    let pairs: Rank[] = [];
    let triples: Rank[] = [];
    let quadruples: Rank[] = [];
    let highestCards: Card[] = [];
    let straight: Rank[] = [];
    debug("suits", suits);
    debug("ranks", ranks);
    forEachRank(rank => {
        // check for pairs, three-of-a-kind, etc.
        const suitsWithThisRank = ranks[rank];
        if (!suitsWithThisRank)
            return;
        if (suitsWithThisRank.length === 2)
            pairs.push(rank);
        if (suitsWithThisRank.length === 3)
            triples.push(rank);
        if (suitsWithThisRank.length === 4)
            quadruples.push(rank);
        // check high cards
        suitsWithThisRank.forEach(suit => {
            highestCards.push({ suit, rank });
        });
        // check for straight
        debug("(straight)", straight);
        if (straight.length === 0) {
            straight.push(rank);
        } else if (straight[straight.length - 1] + 1 === rank) {
            straight.push(rank);
        } else if (straight.length < 5) {
            straight = [rank];
        }
    });
    let flushSuit: Suit = null;
    forEachSuit(suit => {
        if (suits[suit] && suits[suit].length >= 5)
            flushSuit = suit;
    });
    return extractBestHand(pairs, triples, quadruples, highestCards, straight, flushSuit);
}

