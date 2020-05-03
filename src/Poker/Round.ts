import {Card, getShuffledDeck} from "./Card";
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
    isDealer: boolean;
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
        players.forEach((player, i) => {
            this.playerStates.push({
                player,
                hasFolded: false,
                holeCards: [this.deck.pop(), this.deck.pop()],
                isDealer: i === 0,
                amountBetThisRound: 0,
            });
            if (params.useAntes) {
                player.decrementBalance(
                    params.anteBet); // NB: Doesn't affect current bet
                this.pot += params.anteBet;
            }
        });
        if (params.useBlinds) {
            this.playerStates[1].player.decrementBalance(params.smallBlindBet);
            this.playerStates[1].amountBetThisRound = params.smallBlindBet;
            this.currentBet = params.smallBlindBet;
            this.pot += params.smallBlindBet;
            this.playerStates[2].player.decrementBalance(params.bigBlindBet);
            this.playerStates[2].amountBetThisRound = params.bigBlindBet;
            this.currentBet = params.bigBlindBet;
            this.pot += params.bigBlindBet;
            this.didLastRaise = this.playerStates[2].player;
            this.currentIndex = 3;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        } else {
            this.didLastRaise = this.playerStates[0].player;
        }
    }
    public getPot(): number { return this.pot; }
    public getCommunityCards(): ReadonlyArray<Card> {
        return this.communityCards;
    }
    public getStateFor(player: Player): Readonly<PlayerState>|null {
        for (let i = 0; i < this.playerStates.length; ++i) {
            if (this.playerStates[i].player === player)
                return this.playerStates[i];
        }
        return null;
    }
    public makeBet(player: Player, bet: Bet,
                   requestedRaiseAmount: number = 0): void {
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
            if (callAmount > currentPlayer.getBalance())
                throw new Error("FIXME: need to make another pot");
            currentPlayer.decrementBalance(callAmount);
            currentPlayerState.amountBetThisRound += callAmount;
            this.pot += callAmount;
            break;
        case Bet.Raise:
            const raiseAmount = requestedRaiseAmount -
                                callAmount; // Actual amount we're "raising" by
            if (raiseAmount <= 0)
                throw new Error(`You must raise by more than ${callAmount}!`);
            if (!currentPlayer.canAfford(raiseAmount))
                throw new Error(`You can only raise by (at most) ${
                    currentPlayer.getBalance() - callAmount}!`);
            debug(this.currentIndex, "callAmount", callAmount,
                  "requestedRaiseAmount", requestedRaiseAmount, "raiseAmount",
                  raiseAmount);
            debug(" => amountBetThisRound",
                  currentPlayerState.amountBetThisRound, "currentBet",
                  this.currentBet, "pot", this.pot);
            currentPlayer.decrementBalance(requestedRaiseAmount);
            currentPlayerState.amountBetThisRound += requestedRaiseAmount;
            this.currentBet += raiseAmount;
            this.pot += requestedRaiseAmount;
            this.didLastRaise = currentPlayer;
            debug(" => amountBetThisRound",
                  currentPlayerState.amountBetThisRound, "currentBet",
                  this.currentBet, "pot", this.pot);
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
                throw new Error("Not implemented: choosing a winner");
            }
        }
    }
    private doFinish(winners: Player[]): void {
        if (winners.length !== 1)
            throw new Error("Not implemented: multiple winners");
        winners[0].incrementBalance(this.pot);
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
