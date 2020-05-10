"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var Utils_1 = require("../Utils");
var Card_1 = require("./Card");
var DEBUG = false;
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (DEBUG)
        console.log.apply(console, __spread(args));
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
function extractBestHand(pairs, triples, quadruples, highestCards, straight, flushSuit) {
    var highestRanks = highestCards.map(function (_a) {
        var suit = _a.suit, rank = _a.rank;
        return rank;
    });
    var isStraight = straight.length >= 5;
    var isFlush = flushSuit !== null;
    straight = straight.slice(0, 5);
    if (isStraight && isFlush) {
        if (straight[0] === Card_1.Rank.Ace)
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
        var quadruple_1 = quadruples[0];
        var nonQuadruples = highestRanks.filter(function (rank) { return rank !== quadruple_1; });
        var ranks = [
            quadruple_1, quadruple_1, quadruple_1, quadruple_1, nonQuadruples.shift()
        ].sort(function (a, b) { return b - a; });
        return {
            type: HandType.FourOfAKind,
            ranks: ranks,
            pairs: [],
            triples: [],
            quadruples: [quadruple_1]
        };
    }
    if (triples.length && pairs.length) {
        var triple = Math.max.apply(Math, __spread(triples));
        var pair = Math.max.apply(Math, __spread(pairs));
        var ranks = [triple, triple, triple, pair, pair].sort(function (a, b) { return b - a; });
        return {
            type: HandType.FullHouse,
            ranks: ranks,
            pairs: [pair],
            triples: [triple],
            quadruples: []
        };
    }
    if (isFlush) {
        var ranks = highestCards.filter(function (_a) {
            var suit = _a.suit, rank = _a.rank;
            return suit === flushSuit;
        })
            .map(function (_a) {
            var suit = _a.suit, rank = _a.rank;
            return rank;
        })
            .slice(0, 5);
        return {
            type: HandType.Flush,
            ranks: ranks,
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
        var triple_1 = Math.max.apply(Math, __spread(triples));
        var nonTriples = highestRanks.filter(function (rank) { return rank !== triple_1; });
        var ranks = [
            triple_1, triple_1, triple_1, nonTriples.shift(), nonTriples.shift()
        ].sort(function (a, b) { return b - a; });
        return {
            type: HandType.ThreeOfAKind,
            ranks: ranks,
            pairs: [],
            triples: [triple_1],
            quadruples: []
        };
    }
    if (pairs.length > 1) {
        pairs = pairs.sort(function (a, b) { return b - a; });
        var firstPair_1 = pairs.shift();
        var secondPair_1 = pairs.shift();
        var nonPairs = highestRanks.filter(function (rank) { return rank !== firstPair_1 &&
            rank !== secondPair_1; });
        var ranks = [
            firstPair_1, firstPair_1, secondPair_1, secondPair_1, nonPairs.shift()
        ].sort(function (a, b) { return b - a; });
        return {
            type: HandType.TwoPair,
            ranks: ranks,
            pairs: [firstPair_1, secondPair_1],
            triples: [],
            quadruples: []
        };
    }
    if (pairs.length == 1) {
        var pair_1 = Math.max.apply(Math, __spread(pairs));
        var nonPairs = highestRanks.filter(function (rank) { return rank !== pair_1; });
        var ranks = [
            pair_1, pair_1, nonPairs.shift(), nonPairs.shift(), nonPairs.shift()
        ].sort(function (a, b) { return b - a; });
        return {
            type: HandType.Pair,
            ranks: ranks,
            pairs: [pair_1],
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
        suitsWithThisRank.forEach(function (suit) { highestCards.unshift({ suit: suit, rank: rank }); });
        debug("(straight)", straight);
        if (straight.length === 0) {
            straight.unshift(rank);
        }
        else if (straight[0] + 1 === rank) {
            straight.unshift(rank);
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
function compareHands(h0, h1) {
    if (h0.type < h1.type)
        return -1;
    if (h0.type > h1.type)
        return 1;
    var ordering = 0;
    switch (h0.type) {
        case HandType.HighCard:
            Utils_1.zip(h0.ranks, h1.ranks)
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.Pair:
            Utils_1.zip(h0.pairs, h1.pairs)
                .forEach(function (_a) {
                var _b = __read(_a, 2), p0 = _b[0], p1 = _b[1];
                ordering = ordering || (p0 - p1);
            });
            Utils_1.zip(h0.ranks.filter(function (r0) { return r0 !== h0.pairs[0]; }), h1.ranks.filter(function (r1) { return r1 !== h1.pairs[0]; }))
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.TwoPair:
            Utils_1.zip(h0.pairs, h1.pairs)
                .forEach(function (_a) {
                var _b = __read(_a, 2), p0 = _b[0], p1 = _b[1];
                ordering = ordering || (p0 - p1);
            });
            Utils_1.zip(h0.ranks.filter(function (r0) { return r0 !== h0.pairs[0] && r0 !== h0.pairs[1]; }), h1.ranks.filter(function (r1) { return r1 !== h1.pairs[0] && r1 !== h1.pairs[1]; }))
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.ThreeOfAKind:
            Utils_1.zip(h0.triples, h1.triples)
                .forEach(function (_a) {
                var _b = __read(_a, 2), t0 = _b[0], t1 = _b[1];
                ordering = ordering || (t0 - t1);
            });
            Utils_1.zip(h0.ranks.filter(function (r0) { return r0 !== h0.triples[0]; }), h1.ranks.filter(function (r1) { return r1 !== h1.triples[0]; }))
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.Straight:
            Utils_1.zip(h0.ranks, h1.ranks)
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.Flush:
            Utils_1.zip(h0.ranks, h1.ranks)
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.FullHouse:
            Utils_1.zip(h0.triples, h1.triples)
                .forEach(function (_a) {
                var _b = __read(_a, 2), t0 = _b[0], t1 = _b[1];
                ordering = ordering || (t0 - t1);
            });
            Utils_1.zip(h0.pairs, h1.pairs)
                .forEach(function (_a) {
                var _b = __read(_a, 2), p0 = _b[0], p1 = _b[1];
                ordering = ordering || (p0 - p1);
            });
            break;
        case HandType.FourOfAKind:
            Utils_1.zip(h0.quadruples, h1.quadruples)
                .forEach(function (_a) {
                var _b = __read(_a, 2), q0 = _b[0], q1 = _b[1];
                ordering = ordering || (q0 - q1);
            });
            Utils_1.zip(h0.ranks.filter(function (r0) { return r0 !== h0.quadruples[0]; }), h1.ranks.filter(function (r1) { return r1 !== h1.quadruples[0]; }))
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.StraightFlush:
            Utils_1.zip(h0.ranks, h1.ranks)
                .forEach(function (_a) {
                var _b = __read(_a, 2), r0 = _b[0], r1 = _b[1];
                ordering = ordering || (r0 - r1);
            });
            break;
        case HandType.RoyalFlush:
            break;
    }
    return ordering;
}
exports.compareHands = compareHands;
//# sourceMappingURL=Hand.js.map