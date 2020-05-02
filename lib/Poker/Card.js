"use strict";
exports.__esModule = true;
var Utils_1 = require("../Utils");
var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 0] = "Clubs";
    Suit[Suit["Diamonds"] = 1] = "Diamonds";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit = exports.Suit || (exports.Suit = {}));
;
function forEachSuit(callback) {
    for (var suit = Suit.Clubs; suit <= Suit.Spades; ++suit) {
        callback(suit);
    }
}
exports.forEachSuit = forEachSuit;
var Rank;
(function (Rank) {
    Rank[Rank["Two"] = 2] = "Two";
    Rank[Rank["Three"] = 3] = "Three";
    Rank[Rank["Four"] = 4] = "Four";
    Rank[Rank["Five"] = 5] = "Five";
    Rank[Rank["Six"] = 6] = "Six";
    Rank[Rank["Seven"] = 7] = "Seven";
    Rank[Rank["Eight"] = 8] = "Eight";
    Rank[Rank["Nine"] = 9] = "Nine";
    Rank[Rank["Ten"] = 10] = "Ten";
    Rank[Rank["Jack"] = 11] = "Jack";
    Rank[Rank["Queen"] = 12] = "Queen";
    Rank[Rank["King"] = 13] = "King";
    Rank[Rank["Ace"] = 14] = "Ace";
})(Rank = exports.Rank || (exports.Rank = {}));
;
function forEachRank(callback) {
    for (var rank = Rank.Two; rank <= Rank.Ace; ++rank) {
        callback(rank);
    }
}
exports.forEachRank = forEachRank;
;
function getShuffledDeck() {
    var cards = [];
    forEachSuit(function (suit) {
        forEachRank(function (rank) {
            cards.push({ suit: suit, rank: rank });
        });
    });
    return Utils_1.shuffled(cards);
}
exports.getShuffledDeck = getShuffledDeck;
//# sourceMappingURL=Card.js.map