import {sortIntoTiers} from "../Utils";

import {Card} from "./Card";
import {BestHand, compareHands, getBestFiveCardHand} from "./Hand";
import {Player} from "./Player";

const DEBUG = false;
function debug(...args) {
    if (DEBUG)
        console.log(...args);
}

interface PlayerState {
    index: number;
    player: Player;
    hasFolded: boolean;
    holeCards: readonly[Card, Card];
    amountBetThisRound: number;
    maxStakes: number;
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
        .map(ps => {
            return {
                player: ps.player,
                bestHand: ps.hasFolded
                              ? null
                              : getBestFiveCardHand(
                                    communityCards.concat(ps.holeCards))
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

interface Pot {
    maxCumulativeBet: number;
    maxMarginalBet: number;
    marginalBet: number;
    contributions: number[]; // zip with playerStates
}

function commitToPot(pot: Pot, ps: PlayerState, balance: number): number {
    if (balance === 0)
        return 0;
    const index = ps.index;
    const maxCommitment = pot.maxMarginalBet - pot.contributions[index];
    if (maxCommitment === 0)
        return 0;
    const marginalContribution = Math.min(maxCommitment, balance);
    const cumulativeContribution =
        pot.contributions[index] + marginalContribution;
    debug("maxCommitment", maxCommitment);
    debug("marginalBet", pot.marginalBet);
    debug("uncommitted", balance);
    debug("committing", marginalContribution);
    debug("alreadyCommitted", pot.contributions[index]);
    debug("commitment", cumulativeContribution);
    if (pot.marginalBet < cumulativeContribution)
        pot.marginalBet = cumulativeContribution;
    pot.contributions[index] += marginalContribution;
    return balance - marginalContribution;
}

export class Round {
    private readonly playerStates: PlayerState[] = [];
    private deck: Card[];
    private currentIndex: number = 0;
    private communityCards: Card[] = [];
    private currentBet: number = 0;
    private pots: Pot[] = [];
    private didLastRaise: Player;
    private anteBet: number = 0;
    public isFinished: boolean = false;
    constructor(deck: Card[], players: Player[], params: RoundParameters) {
        this.deck = deck;
        players.forEach((player, i) => {
            this.playerStates.push({
                index: i,
                player,
                hasFolded: false,
                holeCards: [this.deck.pop(), this.deck.pop()],
                amountBetThisRound: 0,
                maxStakes: player.balance,
            });
        });
        this.pushPot();
        if (params.useAntes)
            this.playerStates.forEach(
                ps => this.commitBet(ps, params.anteBet, false));
        this.didLastRaise = this.playerStates[0].player;
        if (params.useBlinds) {
            this.commitBet(this.playerStates[1], params.smallBlindBet);
            this.commitBet(this.playerStates[2], params.bigBlindBet);
            this.currentIndex = 3;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        }
    }
    public getPot(): number {
        if (this.isFinished)
            return 0;
        return this.pots.reduce(
            (potAcc, pot) =>
                potAcc + pot.contributions.reduce(
                             (contribAcc, contrib) => contribAcc + contrib, 0),
            0);
    }
    public getPots(): Pot[] { return this.pots; }
    public getCommunityCards(): ReadonlyArray<Card> {
        return this.communityCards;
    }
    public getCurrentBet(): number {
        return this.pots.reduce((acc, pot) => acc + pot.marginalBet, 0);
    }
    public getAmountAlreadyBet(ps: PlayerState): number {
        return this.pots.reduce((acc, pot) => acc + pot.contributions[ps.index],
                                0);
    }
    public getStateFor(player: Player): Readonly<PlayerState>|null {
        for (let i = 0; i < this.playerStates.length; ++i) {
            if (this.playerStates[i].player === player)
                return this.playerStates[i];
        }
        return null;
    }
    private commitBet(ps: PlayerState, amountToCommit: number,
                      affectsRoundTotals: boolean = true): void {
        debug("commitBet", ps.index, amountToCommit, this.pots);
        if (this.getCurrentBet() <
            this.getAmountAlreadyBet(ps) + amountToCommit)
            this.didLastRaise = ps.player;

        let uncommittedAmount = Math.min(ps.player.balance, amountToCommit);
        ps.player.balance -= uncommittedAmount;

        uncommittedAmount =
            this.pots.filter(pot => pot.maxCumulativeBet <= ps.maxStakes)
                .reduce((remaining, pot) => commitToPot(pot, ps, remaining),
                        uncommittedAmount);
        debug("after looping pots", this.pots);

        while (uncommittedAmount > 0) {
            debug("adding a new pot to handle", uncommittedAmount);
            const pot = this.pushPot();
            debug(this.pots);
            uncommittedAmount = commitToPot(pot, ps, uncommittedAmount);
            debug("after adding a new pot", this.pots);
        }
    }
    private pushPot(): Pot {
        const lastMaxCumulativeBet =
            this.pots.length > 0
                ? this.pots[this.pots.length - 1].maxCumulativeBet
                : 0;
        const pot = {
            maxCumulativeBet:
                this.playerStates.filter(ps => !ps.hasFolded)
                    .filter(ps => ps.maxStakes > lastMaxCumulativeBet)
                    .reduce((maxCumulativeBet, ps) =>
                                Math.min(maxCumulativeBet, ps.maxStakes),
                            Infinity),
            maxMarginalBet:
                this.playerStates.filter(ps => !ps.hasFolded)
                    .filter(ps => ps.maxStakes > lastMaxCumulativeBet)
                    .reduce((maxMarginalBet, ps) =>
                                Math.min(maxMarginalBet,
                                         ps.maxStakes - lastMaxCumulativeBet),
                            Infinity),
            marginalBet: 0,
            contributions: this.playerStates.map(_ => 0),
        };
        this.pots.push(pot);
        return pot;
    }
    private filterPots(): void {
        debug("pre-filter", this.pots);
        this.pots = this.pots.filter(pot => {
            const playersThatCanAfford =
                this.playerStates.filter(ps => !ps.hasFolded)
                    .filter(ps => ps.maxStakes >= pot.maxCumulativeBet);
            if (playersThatCanAfford.length > 1)
                return true;
            if (playersThatCanAfford.length === 0)
                throw new Error("This shouldn't happen!");
            const playerToRefund = playersThatCanAfford[0];
            playerToRefund.player.balance += pot.contributions.reduce(
                (acc, contribution) => acc += contribution, 0);
            return false;
        })
        debug("post-filter", this.pots);
    }
    public makeBet(player: Player, bet: Bet, raiseBy: number = 0): void {
        if (this.isFinished)
            throw new Error("Round is over!");
        const currentPlayerState = this.playerStates[this.currentIndex];
        const currentPlayer = currentPlayerState.player;
        const callAmount =
            this.getCurrentBet() - this.getAmountAlreadyBet(currentPlayerState);
        if (currentPlayer !== player)
            throw new Error("This is not the current player!");
        switch (bet) {
        case Bet.Call:
            this.commitBet(currentPlayerState, callAmount);
            break;
        case Bet.Raise:
            if (raiseBy <= 0)
                throw new Error(`You must raise by a positive number!`);
            if (currentPlayer.balance < callAmount + raiseBy)
                throw new Error(`You can not raise by more than your balance!`);
            const highestPossibleBet =
                this.playerStates.filter(ps => !ps.hasFolded)
                    .filter(ps => ps !== currentPlayerState)
                    .map(ps => ps.player.balance + this.getAmountAlreadyBet(ps))
                    .reduce((a, b) => Math.max(a, b), 0);
            if (callAmount + raiseBy > highestPossibleBet)
                throw new Error(
                    `You cannot bet more than ${highestPossibleBet}`);
            this.commitBet(currentPlayerState, callAmount + raiseBy);
            break;
        case Bet.Fold:
            currentPlayerState.hasFolded = true;
            const nonFoldedPlayers =
                this.playerStates.filter(ps => !ps.hasFolded);
            if (nonFoldedPlayers.length == 1) {
                this.doFinish([nonFoldedPlayers[0].player]);
                return;
            }
            this.filterPots();
            break;
        }
        do {
            ++this.currentIndex;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        } while (this.playerStates[this.currentIndex].hasFolded ||
                 this.playerStates[this.currentIndex].player.balance === 0)
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
        if (this.pots.length !== 1)
            throw new Error("Not implemented: winning with side pots");
        winners[0].balance += this.getPot();
        this.isFinished = true;
    }
};
