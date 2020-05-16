"use strict";
exports.__esModule = true;
require("mocha");
var chai_1 = require("chai");
var Card_1 = require("../Card");
var Hand_1 = require("../Hand");
describe("Hand", function () {
    describe("calculate best hands", function () {
        var expectHand = function (cards, handType, highestRanks) {
            if (highestRanks === void 0) { highestRanks = []; }
            var bestHand = Hand_1.getBestFiveCardHand(cards);
            chai_1.expect(bestHand.type).to.equal(handType);
            highestRanks.forEach(function (rank, i) { chai_1.expect(bestHand.ranks[i]).to.equal(rank); });
        };
        it("RoyalFlush", function () {
            expectHand([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.RoyalFlush);
        });
        it("StraightFlush", function () {
            expectHand([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
            ], Hand_1.HandType.StraightFlush, [Card_1.Rank.Eight]);
            expectHand([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Nine },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
            ], Hand_1.HandType.StraightFlush, [Card_1.Rank.Ten]);
        });
        it("FourOfAKind", function () {
            expectHand([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.FourOfAKind, [Card_1.Rank.Ace, Card_1.Rank.Two]);
        });
        it("FullHouse", function () {
            expectHand([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.FullHouse, [Card_1.Rank.Three]);
        });
        it("Flush", function () {
            expectHand([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
            ], Hand_1.HandType.Flush);
        });
        it("Straight", function () {
            expectHand([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
            ], Hand_1.HandType.Straight, [Card_1.Rank.Six]);
        });
        it("ThreeOfAKind", function () {
            expectHand([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.ThreeOfAKind, [Card_1.Rank.Ace, Card_1.Rank.King, Card_1.Rank.Three]);
        });
        it("TwoPair", function () {
            expectHand([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.TwoPair, [Card_1.Rank.Ace, Card_1.Rank.Ten, Card_1.Rank.Ten, Card_1.Rank.Three]);
        });
        it("Pair", function () {
            expectHand([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.Pair, [Card_1.Rank.Ace, Card_1.Rank.King, Card_1.Rank.Jack, Card_1.Rank.Two, Card_1.Rank.Two]);
        });
        it("HighCard", function () {
            expectHand([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
            ], Hand_1.HandType.HighCard, [Card_1.Rank.Ten, Card_1.Rank.Eight, Card_1.Rank.Seven, Card_1.Rank.Five, Card_1.Rank.Four]);
            expectHand([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], Hand_1.HandType.HighCard, [Card_1.Rank.Ace, Card_1.Rank.King, Card_1.Rank.Jack, Card_1.Rank.Ten, Card_1.Rank.Four]);
        });
    });
    describe("compare best hands", function () {
        var expectCompareHands = function (c0, c1, expectedOrdering) {
            var h0 = Hand_1.getBestFiveCardHand(c0);
            var h1 = Hand_1.getBestFiveCardHand(c1);
            var actualOrdering = Hand_1.compareHands(h0, h1);
            if (expectedOrdering < 0) {
                chai_1.expect(actualOrdering).to.be.lessThan(0);
            }
            else if (expectedOrdering > 0) {
                chai_1.expect(actualOrdering).to.be.greaterThan(0);
            }
            else {
                chai_1.expect(actualOrdering).to.equal(0);
            }
        };
        it("when the hand type is different", function () {
            expectCompareHands([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
            ], [
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
            ], 1);
            expectCompareHands([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
            ], [
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
            ], -1);
            expectCompareHands([
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Nine },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
            ], [
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], -1);
            expectCompareHands([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], [
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], 1);
            expectCompareHands([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], [
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], 1);
            expectCompareHands([
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], [
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Four },
                { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
            ], 1);
        });
        describe("when the hand type is the same", function () {
            it("RoyalFlush", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ace },
                ], 0);
            });
            it("StraightFlush", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                ], -1);
            });
            it("FourOfAKind", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                ], -1);
            });
            it("FullHouse", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Diamonds, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
            });
            it("Flush", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ten },
                ], -1);
            });
            it("Straight", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Nine },
                ], -1);
            });
            it("ThreeOfAKind", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
            });
            it("TwoPair", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], 1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
            });
            it("Pair", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], [
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Spades, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.King },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Ace },
                ], -1);
            });
            it("HighCard", function () {
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                ], 0);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ten },
                ], -1);
                expectCompareHands([
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Six },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Nine },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Jack },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Queen },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.King },
                ], [
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Two },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Three },
                    { suit: Card_1.Suit.Hearts, rank: Card_1.Rank.Four },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Five },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Seven },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Eight },
                    { suit: Card_1.Suit.Clubs, rank: Card_1.Rank.Ace },
                ], -1);
            });
        });
    });
});
//# sourceMappingURL=Hand.js.map