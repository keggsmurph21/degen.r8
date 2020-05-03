import {shuffled} from "../Utils";

export enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
}

export function forEachSuit(callback: (_: Suit) => void): void {
    for (let suit = Suit.Clubs; suit <= Suit.Spades; ++suit) {
        callback(suit);
    }
}

export enum Rank {
    Two = 2,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace,
}

export function forEachRank(callback: (_: Rank) => void): void {
    for (let rank = Rank.Two; rank <= Rank.Ace; ++rank) {
        callback(rank);
    }
}

export interface Card {
    suit: Suit;
    rank: Rank;
}
;

export function getShuffledDeck(): Card[] {
    let cards: Card[] = [];
    forEachSuit(
        suit => { forEachRank(rank => { cards.push({suit: suit, rank}); }); });
    return shuffled(cards);
}
