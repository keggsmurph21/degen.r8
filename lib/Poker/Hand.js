"use strict";
exports.__esModule = true;
var Card_1 = require("./Card");
var DEBUG = false;
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (DEBUG)
        console.log.apply(console, args);
}
var HandType;
(function (HandType) {
    HandType[HandType["HighCard"] = 0] = "HighCard";
    HandType[HandType["Pair"] = 1] = "Pair";
    HandType[HandType["TwoPair"] = 2] = "TwoPair";
    HandType[HandType["ThreeOfAKind"] = 3] = "ThreeOfAKind";
    HandType[HandType["Straight"] = 4] = "Straight";
    HandType[HandType["Flush"] = 5] = "Flush";
    HandType[HandType["FullHouse"] = 6] = "FullHouse";
    HandType[HandType["FourOfAKind"] = 7] = "FourOfAKind";
    HandType[HandType["StraightFlush"] = 8] = "StraightFlush";
    HandType[HandType["RoyalFlush"] = 9] = "RoyalFlush";
})(HandType = exports.HandType || (exports.HandType = {}));
;
function extractBestHand(pairs, triples, quadruples, highestCards, straight, flushSuit) {
    var highestRanks = highestCards.map(function (_a) {
        var suit = _a.suit, rank = _a.rank;
        return rank;
    });
    var isStraight = straight.length >= 5;
    var isFlush = flushSuit !== null;
    straight = straight.slice(-5);
    if (isStraight && isFlush) {
        if (straight[straight.length - 1] === Card_1.Rank.Ace)
            return { type: HandType.RoyalFlush, ranks: straight };
        return { type: HandType.StraightFlush, ranks: straight };
    }
    if (quadruples.length) {
        var quadruple_1 = quadruples[0];
        var nonQuadruples = highestRanks.filter(function (rank) { return rank !== quadruple_1; });
        var ranks = [quadruple_1, quadruple_1, quadruple_1, quadruple_1, nonQuadruples.pop()].sort(function (a, b) { return a - b; });
        return { type: HandType.FourOfAKind, ranks: ranks };
    }
    if (triples.length && pairs.length) {
        var triple = Math.max.apply(Math, triples);
        var pair = Math.max.apply(Math, pairs);
        var ranks = [triple, triple, triple, pair, pair].sort(function (a, b) { return a - b; });
        return { type: HandType.FullHouse, ranks: ranks };
    }
    if (isFlush) {
        var ranks = highestCards
            .filter(function (_a) {
            var suit = _a.suit, rank = _a.rank;
            return suit === flushSuit;
        })
            .map(function (_a) {
            var suit = _a.suit, rank = _a.rank;
            return rank;
        })
            .slice(-5);
        return { type: HandType.Flush, ranks: ranks };
    }
    if (isStraight)
        return { type: HandType.Straight, ranks: straight };
    if (triples.length) {
        var triple_1 = Math.max.apply(Math, triples);
        var nonTriples = highestRanks.filter(function (rank) { return rank !== triple_1; });
        var ranks = [triple_1, triple_1, triple_1, nonTriples.pop(), nonTriples.pop()].sort(function (a, b) { return a - b; });
        return { type: HandType.ThreeOfAKind, ranks: ranks };
    }
    if (pairs.length > 1) {
        pairs = pairs.sort(function (a, b) { return a - b; });
        var firstPair_1 = pairs.pop();
        var secondPair_1 = pairs.pop();
        var nonPairs = highestRanks.filter(function (rank) { return rank !== firstPair_1 && rank !== secondPair_1; });
        var ranks = [firstPair_1, firstPair_1, secondPair_1, secondPair_1, nonPairs.pop()].sort(function (a, b) { return a - b; });
        return { type: HandType.TwoPair, ranks: ranks };
    }
    if (pairs.length == 1) {
        var pair_1 = Math.max.apply(Math, pairs);
        var nonPairs = highestRanks.filter(function (rank) { return rank !== pair_1; });
        var ranks = [pair_1, pair_1, nonPairs.pop(), nonPairs.pop(), nonPairs.pop()].sort(function (a, b) { return a - b; });
        return { type: HandType.Pair, ranks: ranks };
    }
    return { type: HandType.HighCard, ranks: highestRanks.slice(-5) };
}
function getBestFiveCardHand(cards) {
    debug(cards);
    var suits = {};
    var ranks = {};
    cards.forEach(function (_a) {
        var suit = _a.suit, rank = _a.rank;
        if (suits[suit] === undefined)
            suits[suit] = [];
        suits[suit].push(rank);
        if (ranks[rank] === undefined)
            ranks[rank] = [];
        ranks[rank].push(suit);
    });
    var pairs = [];
    var triples = [];
    var quadruples = [];
    var highestCards = [];
    var straight = [];
    debug("suits", suits);
    debug("ranks", ranks);
    Card_1.forEachRank(function (rank) {
        var suitsWithThisRank = ranks[rank];
        if (!suitsWithThisRank)
            return;
        if (suitsWithThisRank.length === 2)
            pairs.push(rank);
        if (suitsWithThisRank.length === 3)
            triples.push(rank);
        if (suitsWithThisRank.length === 4)
            quadruples.push(rank);
        suitsWithThisRank.forEach(function (suit) {
            highestCards.push({ suit: suit, rank: rank });
        });
        debug("(straight)", straight);
        if (straight.length === 0) {
            straight.push(rank);
        }
        else if (straight[straight.length - 1] + 1 === rank) {
            straight.push(rank);
        }
        else if (straight.length < 5) {
            straight = [rank];
        }
    });
    var flushSuit = null;
    Card_1.forEachSuit(function (suit) {
        if (suits[suit] && suits[suit].length >= 5)
            flushSuit = suit;
    });
    return extractBestHand(pairs, triples, quadruples, highestCards, straight, flushSuit);
}
exports.getBestFiveCardHand = getBestFiveCardHand;
//# sourceMappingURL=Hand.js.map