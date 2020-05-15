import {findFirst, sortIntoTiers, zip} from "../Utils";
import {Card} from "./Card";
import {BestHand, compareHands, getBestFiveCardHand} from "./Hand";

const DEBUG = false;
function debug(...args: any) {
    if (DEBUG)
        console.log(...args);
}

export interface Player {
    id: number;
    balance: number;
}

export interface PublicPlayerState {
    index: number;
    playerId: number;
    balance: number;
    hasFolded: boolean;
    maxStakes: number;
}

export interface PrivatePlayerState extends PublicPlayerState {
    holeCards: readonly[Card, Card];
}

export interface PlayerState extends PrivatePlayerState {}

export interface SerialRound {
    playerStates: PlayerState[];
    deck: Card[];
    minimumBet: number;
    currentIndex: number;
    communityCards: Card[];
    pots: Pot[];
    didLastRaiseIndex: number;
    isFinished: boolean;
}

export enum Bet {
    Call,
    Raise,
    Fold,
}

interface ScorableHand {
    playerState: PlayerState, bestHand: BestHand,
}

function getScorableHands(playerStates: PlayerState[],
                          communityCards: Card[]): ScorableHand[] {
    return playerStates
        .map(ps => {
            return {
                playerState: ps,
                bestHand: ps.hasFolded
                              ? null
                              : getBestFiveCardHand(
                                    communityCards.concat(ps.holeCards))
            };
        })
        .filter(({playerState, bestHand}) => bestHand !== null);
}

export function getWinners(playerStates: PlayerState[],
                           communityCards: Card[]): PlayerState[] {
    return sortIntoTiers(getScorableHands(playerStates, communityCards),
                         (a, b) => compareHands(a.bestHand, b.bestHand))
        .pop()
        .map(h => h.playerState);
}

export interface RoundView {
    myPlayerState: PrivatePlayerState;
    otherPlayerStates: PublicPlayerState[];
    minimumBet: number;
    communityCards: Card[];
    pots: Pot[];
    didLastRaiseIndex: number;
    isFinished: boolean;
}

export interface RoundParameters {
    minimumBet: number;
    useBlinds: boolean;
    bigBlindBet: number;
    smallBlindBet: number;
    useAntes: boolean;
    anteBet: number;
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
    const marginalContrib = Math.min(maxCommitment, balance);
    const cumulativeContrib = pot.contributions[index] + marginalContrib;
    debug("maxCommitment", maxCommitment);
    debug("marginalBet", pot.marginalBet);
    debug("uncommitted", balance);
    debug("committing", marginalContrib);
    debug("alreadyCommitted", pot.contributions[index]);
    debug("commitment", cumulativeContrib);
    if (pot.marginalBet < cumulativeContrib)
        pot.marginalBet = cumulativeContrib;
    pot.contributions[index] += marginalContrib;
    return balance - marginalContrib;
}

export class Round {
    private playerStates: PlayerState[] = [];
    private deck: Card[];
    private currentIndex: number = 0;
    private communityCards: Card[] = [];
    private pots: Pot[] = [];
    private didLastRaiseIndex: number = 0;
    public minimumBet: number;
    public isFinished: boolean = false;
    private constructor() {}
    public static create(deck: Card[], players: Player[],
                         params: RoundParameters): Round {
        const round = new Round();
        round.deck = deck;
        round.minimumBet = params.minimumBet;
        players.forEach((player, i) => {
            round.playerStates.push({
                index: i,
                playerId: player.id,
                hasFolded: false,
                holeCards: [round.deck.pop(), round.deck.pop()],
                balance: player.balance,
                maxStakes: player.balance,
            });
        });
        round.pushPot();
        if (params.useAntes)
            round.playerStates.forEach(
                ps => round.commitBet(ps, params.anteBet, false));
        if (params.useBlinds) {
            if (round.playerStates.length === 0)
                throw new Error(`You cannot start a round with no players!`);
            if (round.playerStates.length === 1)
                throw new Error(`You cannot start a round with 1 player!`);
            if (round.playerStates.length === 2) {
                round.commitBet(round.playerStates[0], params.smallBlindBet);
                round.commitBet(round.playerStates[1], params.bigBlindBet);
                round.currentIndex = 0;
            } else {
                round.commitBet(round.playerStates[1], params.smallBlindBet);
                round.commitBet(round.playerStates[2], params.bigBlindBet);
                round.currentIndex = round.playerStates.length === 3 ? 0 : 3;
            }
        }
        return round;
    }
    public static deserialize(serial: SerialRound): Round {
        const round = new Round();
        round.playerStates = serial.playerStates.slice();
        round.minimumBet = serial.minimumBet;
        round.deck = serial.deck;
        round.currentIndex = serial.currentIndex;
        round.communityCards = serial.communityCards;
        round.pots = serial.pots.map(pot => {
            return { ...pot, contributions: pot.contributions.slice() }
        });
        round.didLastRaiseIndex = serial.didLastRaiseIndex;
        round.isFinished = serial.isFinished;
        return round;
    }
    public serialize(): SerialRound {
        return {
            playerStates: this.playerStates.slice(),
            minimumBet: this.minimumBet,
            deck: this.deck.slice(),
            currentIndex: this.currentIndex,
            communityCards: this.communityCards.slice(),
            pots: this.pots.map(pot => {
                return { ...pot, contributions: pot.contributions.slice() }
            }),
            didLastRaiseIndex: this.didLastRaiseIndex,
            isFinished: this.isFinished,
        };
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
    public getCurrentIndex(): number { return this.currentIndex; }
    public getDidLastRaiseIndex(): number { return this.didLastRaiseIndex; }
    public getPlayerStates(): PlayerState[] {
        return this.playerStates.slice();
    }
    private commitBet(ps: PlayerState, amountToCommit: number,
                      affectsRoundTotals: boolean = true): void {
        debug("commitBet", ps.index, amountToCommit, this.pots);
        if (this.getCurrentBet() <
            this.getAmountAlreadyBet(ps) + amountToCommit)
            this.didLastRaiseIndex = ps.index;

        let uncommittedAmount = Math.min(ps.balance, amountToCommit);
        ps.balance -= uncommittedAmount;

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
            playerToRefund.balance +=
                pot.contributions.reduce((acc, contrib) => acc += contrib, 0);
            return false;
        })
        debug("post-filter", this.pots);
    }
    public makeBet(playerId: number, bet: Bet, raiseBy: number = 0): void {
        if (this.isFinished)
            throw new Error("Round is over!");
        const currentPlayerState = this.playerStates[this.currentIndex];
        const callAmount =
            this.getCurrentBet() - this.getAmountAlreadyBet(currentPlayerState);
        if (playerId !== currentPlayerState.playerId)
            throw new Error("This is not the current player!");
        switch (bet) {
        case Bet.Call:
            this.commitBet(currentPlayerState, callAmount);
            break;
        case Bet.Raise:
            if (raiseBy < this.minimumBet)
                throw new Error(
                    `You must raise by at least ${this.minimumBet}!`);
            if (currentPlayerState.balance < callAmount + raiseBy)
                throw new Error(`You can not raise by more than your balance!`);
            const highestPossibleBet =
                this.playerStates.filter(ps => !ps.hasFolded)
                    .filter(ps => ps !== currentPlayerState)
                    .map(ps => ps.balance + this.getAmountAlreadyBet(ps))
                    .reduce((a, b) => Math.max(a, b), 0);
            if (callAmount + raiseBy > highestPossibleBet)
                throw new Error(
                    `You cannot bet more than ${highestPossibleBet}`);
            this.commitBet(currentPlayerState, callAmount + raiseBy);
            break;
        case Bet.Fold:
            currentPlayerState.hasFolded = true;
            this.filterPots();
            const nonFoldedPlayers =
                this.playerStates.filter(ps => !ps.hasFolded);
            if (nonFoldedPlayers.length == 1) {
                this.doFinish();
                return;
            }
            break;
        }
        do {
            ++this.currentIndex;
            if (this.currentIndex >= this.playerStates.length)
                this.currentIndex -= this.playerStates.length;
        } while (this.playerStates[this.currentIndex].hasFolded ||
                 this.playerStates[this.currentIndex].balance === 0)
        if (this.didLastRaiseIndex === this.currentIndex) {
            if (this.communityCards.length === 0) {
                this.communityCards.push(this.deck.pop());
                this.communityCards.push(this.deck.pop());
                this.communityCards.push(this.deck.pop());
            } else if (this.communityCards.length === 3) {
                this.communityCards.push(this.deck.pop());
            } else if (this.communityCards.length === 4) {
                this.communityCards.push(this.deck.pop());
            } else if (this.communityCards.length === 5) {
                this.doFinish();
            }
        }
    }
    private doFinish(): void {
        this.pots.forEach(pot => {
            const candidates = pot.contributions
                                   .map((contrib, index) => {
                                       if (contrib === 0)
                                           return null;
                                       return this.playerStates[index];
                                   })
                                   .filter(ps => ps !== null);
            const potBalance =
                pot.contributions.reduce((acc, contrib) => acc += contrib, 0);
            getWinners(candidates, this.communityCards)
                .forEach((ps, _, winners) => {
                    ps.balance += potBalance / winners.length;
                });
        });
        this.isFinished = true;
    }
    public getBalance(playerId: number): number {
        const playerState =
            findFirst(this.playerStates, ps => ps.playerId === playerId);
        return playerState ? playerState.balance : null;
    }
    public addBalance(playerId: number, credit: number): void {
        const playerState =
            findFirst(this.playerStates, ps => ps.playerId === playerId);
        if (playerState !== null)
            playerState.balance += credit;
    }
};
