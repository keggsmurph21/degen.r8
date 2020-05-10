import {zip} from "../Utils";
import {Card, forEachRank, forEachSuit, Rank, Suit} from "./Card";

const DEBUG = false;
function debug(...args: any) {
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
}

export type BestHand = {
    readonly type: HandType,
    ranks: Rank[],
    pairs: Rank[],
    triples: Rank[],
    quadruples: Rank[],
};

function extractBestHand(pairs: Rank[], triples: Rank[], quadruples: Rank[],
                         highestCards: Card[], straight: Rank[],
                         flushSuit: Suit|null): BestHand {
    const highestRanks = highestCards.map(({suit, rank}) => rank);
    const isStraight = straight.length >= 5;
    const isFlush = flushSuit !== null;
    straight = straight.slice(0, 5);
    // Actually determine the best hand
    if (isStraight && isFlush) {
        if (straight[0] === Rank.Ace)
            return {
                type: HandType.RoyalFlush,
                ranks: straight,
                pairs: [],
                triples: [],
                quadruples: []
            };
        return {
            type: HandType.StraightFlush,
            ranks: straight,
            pairs: [],
            triples: [],
            quadruples: []
        };
    }
    if (quadruples.length) {
        const quadruple = quadruples[0]; // there can only be one
        const nonQuadruples = highestRanks.filter(rank => rank !== quadruple);
        const ranks = [
            quadruple, quadruple, quadruple, quadruple, nonQuadruples.shift()
        ].sort((a, b) => b - a);
        return {
            type: HandType.FourOfAKind,
            ranks,
            pairs: [],
            triples: [],
            quadruples: [quadruple]
        };
    }
    if (triples.length && pairs.length) {
        const triple = Math.max(...triples);
        const pair = Math.max(...pairs);
        const ranks =
            [triple, triple, triple, pair, pair].sort((a, b) => b - a);
        return {
            type: HandType.FullHouse,
            ranks,
            pairs: [pair],
            triples: [triple],
            quadruples: []
        };
    }
    if (isFlush) {
        const ranks = highestCards.filter(({suit, rank}) => suit === flushSuit)
                          .map(({suit, rank}) => rank)
                          .slice(0, 5);
        return {
            type: HandType.Flush,
            ranks,
            pairs: [],
            triples: [],
            quadruples: []
        };
    }
    if (isStraight)
        return {
            type: HandType.Straight,
            ranks: straight,
            pairs: [],
            triples: [],
            quadruples: []
        };
    if (triples.length) {
        const triple = Math.max(...triples);
        const nonTriples = highestRanks.filter(rank => rank !== triple);
        const ranks = [
            triple, triple, triple, nonTriples.shift(), nonTriples.shift()
        ].sort((a, b) => b - a);
        return {
            type: HandType.ThreeOfAKind,
            ranks,
            pairs: [],
            triples: [triple],
            quadruples: []
        };
    }
    if (pairs.length > 1) {
        pairs = pairs.sort((a, b) => b - a);
        const firstPair = pairs.shift();
        const secondPair = pairs.shift();
        const nonPairs = highestRanks.filter(rank => rank !== firstPair &&
                                                     rank !== secondPair);
        const ranks = [
            firstPair, firstPair, secondPair, secondPair, nonPairs.shift()
        ].sort((a, b) => b - a);
        return {
            type: HandType.TwoPair,
            ranks,
            pairs: [firstPair, secondPair],
            triples: [],
            quadruples: []
        };
    }
    if (pairs.length == 1) {
        const pair = Math.max(...pairs);
        const nonPairs = highestRanks.filter(rank => rank !== pair);
        const ranks = [
            pair, pair, nonPairs.shift(), nonPairs.shift(), nonPairs.shift()
        ].sort((a, b) => b - a);
        return {
            type: HandType.Pair,
            ranks,
            pairs: [pair],
            triples: [],
            quadruples: []
        };
    }
    return {
        type: HandType.HighCard,
        ranks: highestRanks.slice(0, 5),
        pairs: [],
        triples: [],
        quadruples: []
    };
}

export function getBestFiveCardHand(cards: Card[]): BestHand {
    debug(cards);
    // make maps of Suit => Rank[] and Rank => Suit[]
    const suits: {[_ in Suit]?: Rank[]} = {};
    const ranks: {[_ in Rank]?: Suit[]} = {};
    cards.forEach(({suit, rank}) => {
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
        suitsWithThisRank.forEach(
            suit => { highestCards.unshift({suit, rank}); });
        // check for straight
        debug("(straight)", straight);
        if (straight.length === 0) {
            straight.unshift(rank);
        } else if (straight[0] + 1 === rank) {
            straight.unshift(rank);
        } else if (straight.length < 5) {
            straight = [rank];
        }
    });
    let flushSuit: Suit = null;
    forEachSuit(suit => {
        if (suits[suit] && suits[suit].length >= 5)
            flushSuit = suit;
    });
    return extractBestHand(pairs, triples, quadruples, highestCards, straight,
                           flushSuit);
}

export function compareHands(h0: BestHand, h1: BestHand): number {
    // Returns (neg) if h0 is less valuable than h1, (zero) if the hands are
    // of equal value, etc.  This is useful with the Array.prototype.sort
    // implementation.
    if (h0.type < h1.type)
        return -1;
    if (h0.type > h1.type)
        return 1;
    let ordering = 0;
    switch (h0.type) {
    case HandType.HighCard:
        zip(h0.ranks, h1.ranks)
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.Pair:
        zip(h0.pairs, h1.pairs)
            .forEach(([p0, p1]) => { ordering = ordering || (p0 - p1); });
        zip(h0.ranks.filter(r0 => r0 !== h0.pairs[0]),
            h1.ranks.filter(r1 => r1 !== h1.pairs[0]))
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.TwoPair:
        zip(h0.pairs, h1.pairs)
            .forEach(([p0, p1]) => { ordering = ordering || (p0 - p1); });
        zip(h0.ranks.filter(r0 => r0 !== h0.pairs[0] && r0 !== h0.pairs[1]),
            h1.ranks.filter(r1 => r1 !== h1.pairs[0] && r1 !== h1.pairs[1]))
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.ThreeOfAKind:
        zip(h0.triples, h1.triples)
            .forEach(([t0, t1]) => { ordering = ordering || (t0 - t1); });
        zip(h0.ranks.filter(r0 => r0 !== h0.triples[0]),
            h1.ranks.filter(r1 => r1 !== h1.triples[0]))
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.Straight:
        zip(h0.ranks, h1.ranks)
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.Flush:
        zip(h0.ranks, h1.ranks)
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.FullHouse:
        zip(h0.triples, h1.triples)
            .forEach(([t0, t1]) => { ordering = ordering || (t0 - t1); });
        zip(h0.pairs, h1.pairs)
            .forEach(([p0, p1]) => { ordering = ordering || (p0 - p1); });
        break;
    case HandType.FourOfAKind:
        zip(h0.quadruples, h1.quadruples)
            .forEach(([q0, q1]) => { ordering = ordering || (q0 - q1); });
        zip(h0.ranks.filter(r0 => r0 !== h0.quadruples[0]),
            h1.ranks.filter(r1 => r1 !== h1.quadruples[0]))
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.StraightFlush:
        zip(h0.ranks, h1.ranks)
            .forEach(([r0, r1]) => { ordering = ordering || (r0 - r1); });
        break;
    case HandType.RoyalFlush:
        // not possible to have multiple royal flushes, although logically it
        // should be a tie, so we can safely do nothing here
        break;
    }
    return ordering;
}
