import {sortIntoTiers} from "../Utils";

import {Card, getShuffledDeck} from "./Card";
import {BestHand, compareHands, getBestFiveCardHand} from "./Hand";
import {Player} from "./Player";

const DEBUG = false;
function debug(...args) {
    if (DEBUG)
        console.log(...args);
}

interface PlayerState {
    player: Player;
    hasFolded: boolean;
    holeCards: readonly[Card, Card];
    amountBetThisRound: number;
}

export enum Bet {
    Call,
    Raise,
    Fold,
}

interface RoundParameters {
    minimumBet: number;
    useBlinds: boolean;
    bigBlindBet: number;
    smallBlindBet: number;
    useAntes: boolean;
    anteBet: number;
}

interface ScorableHand {
    player: Player, bestHand: BestHand,
}

function getScorableHands(playerStates: PlayerState[],
                          communityCards: Card[]): ScorableHand[] {
    return playerStates
        .map(playerState => {
            return {
                player: playerState.player,
                bestHand: playerState.hasFolded
                              ? null
                              : getBestFiveCardHand(communityCards.concat(
                                    playerState.holeCards))
            };
        })
        .filter(({player, bestHand}) => bestHand !== null);
}

export function getWinners(playerStates: PlayerState[],
                           communityCards: Card[]): Player[] {
    return sortIntoTiers(getScorableHands(playerStates, communityCards),
                         (a, b) => compareHands(a.bestHand, b.bestHand))
        .pop()
        .map(h => h.player);
}

export class Round {
    private readonly playerStates: PlayerState[] = [];
    private deck: Card[] = getShuffledDeck();
    private currentIndex: number = 0;
    private communityCards: Card[] = [];
    private currentBet: number = 0;
    private pot: number = 0;
    private didLastRaise: Player;
    public isFinished: boolean = false;
    constructor(players: Player[], params: RoundParameters) {
        players.forEach(player => {
            this.playerStates.push({
                player,
                hasFolded: false,
                holeCards: [this.deck.pop(), this.deck.pop()],
                amountBetThisRound: 0,
            });
            if (params.useAntes)
                this.commitBet(this.playerStates[this.playerStates.length - 1],
                               params.anteBet, false);
        });
        this.didLastRaise = this.playerStates[0].player;
        if (params.useBlinds) {
            this.commitBet(this.playerStates[1], params.smallBlindBet);
            this.commitBet(this.playerStates[2], params.bigBlindBet);
            this.currentIndex = 3;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        }
    }
    public getPot(): number { return this.pot; }
    public getCommunityCards(): ReadonlyArray<Card> {
        return this.communityCards;
    }
    public getCurrentBet(): number { return this.currentBet; }
    public getStateFor(player: Player): Readonly<PlayerState>|null {
        for (let i = 0; i < this.playerStates.length; ++i) {
            if (this.playerStates[i].player === player)
                return this.playerStates[i];
        }
        return null;
    }
    private commitBet(playerState: PlayerState, amount: number,
                      affectsRoundTotals: boolean = true): void {
        if (playerState.player.balance < amount)
            throw new Error("FIXME: need to make another pot");
        playerState.player.balance -= amount;
        if (affectsRoundTotals) {
            playerState.amountBetThisRound += amount;
            if (this.currentBet < playerState.amountBetThisRound)
                this.didLastRaise = playerState.player;
        }
        this.currentBet = playerState.amountBetThisRound;
        this.pot += amount;
    }
    public makeBet(player: Player, bet: Bet, raiseBy: number = 0): void {
        if (this.isFinished)
            throw new Error("Round is over!");
        const currentPlayerState = this.playerStates[this.currentIndex];
        const currentPlayer = currentPlayerState.player;
        const callAmount =
            this.currentBet - currentPlayerState.amountBetThisRound;
        if (currentPlayer !== player)
            throw new Error("This is not the current player!");
        switch (bet) {
        case Bet.Call:
            this.commitBet(currentPlayerState, callAmount);
            break;
        case Bet.Raise:
            if (raiseBy <= 0)
                throw new Error(`You must raise by a positive number!`);
            this.commitBet(currentPlayerState, callAmount + raiseBy);
            break;
        case Bet.Fold:
            currentPlayerState.hasFolded = true;
            const remaining = this.playerStates
                                  .map(playerState => {
                                      if (!playerState.hasFolded)
                                          return playerState;
                                  })
                                  .filter(ps => ps !== undefined);
            if (remaining.length == 1) {
                this.doFinish([remaining[0].player]);
                return;
            }
            break;
        }
        do {
            ++this.currentIndex;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        } while (this.playerStates[this.currentIndex].hasFolded);
        if (this.didLastRaise === this.playerStates[this.currentIndex].player) {
            if (this.communityCards.length === 0) {
                this.communityCards.push(this.deck.pop());
                this.communityCards.push(this.deck.pop());
                this.communityCards.push(this.deck.pop());
            } else if (this.communityCards.length === 3) {
                this.communityCards.push(this.deck.pop());
            } else if (this.communityCards.length === 4) {
                this.communityCards.push(this.deck.pop());
            } else if (this.communityCards.length === 5) {
                this.doFinish(
                    getWinners(this.playerStates, this.communityCards));
            }
        }
    }
    private doFinish(winners: Player[]): void {
        if (winners.length !== 1)
            throw new Error("Not implemented: multiple winners");
        winners[0].balance += this.pot;
        this.pot = 0;
        this.isFinished = true;
    }
    public dump(): void {
        console.log("--");
        if (this.isFinished) {
            console.log("(round is over)");
            return;
        }
        this.playerStates.forEach(playerState => console.log(playerState));
        console.log("currentIndex:", this.currentIndex);
        console.log("communityCards:", this.communityCards);
        console.log("pot:", this.pot);
        console.log("currentBet:", this.currentBet);
    }
};
