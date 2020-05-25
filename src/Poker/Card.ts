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

export function charForSuit(suit: Suit): string {
    switch (suit) {
    case Suit.Clubs:
        return "\u2663";
    case Suit.Diamonds:
        return "\u2666";
    case Suit.Hearts:
        return "\u2665";
    case Suit.Spades:
        return "\u2660";
    }
    return null;
}

export function displayNameForSuit(suit: Suit): string {
    switch (suit) {
    case Suit.Clubs:
        return "clubs";
    case Suit.Diamonds:
        return "diamonds";
    case Suit.Hearts:
        return "hearts";
    case Suit.Spades:
        return "spades";
    }
    return null;
}

export function charForRank(rank: Rank): string {
    if (!rank)
        return null;
    switch (rank) {
    case Rank.Jack:
        return "J";
    case Rank.Queen:
        return "Q";
    case Rank.King:
        return "K";
    case Rank.Ace:
        return "A";
    default:
        return rank.toString();
    }
}
