import {clamp, findFirst, permute, zip} from "../Utils";

import {Card, getShuffledDeck} from "./Card";
import {
    ADD_BALANCE,
    ANTE_BET,
    AUTOPLAY_INTERVAL,
    BIG_BLIND_BET,
    CAPACITY,
    MINIMUM_BET,
    SMALL_BLIND_BET,
    USE_ANTES,
    USE_BLINDS,
} from "./Defaults";
import {Bet, Round, RoundParameters, RoundView, SerialRound} from "./Round";

export interface RoomSummary {
    id: number;
    numSitting: number;
    capacity: number;
    numStanding: number;
    minimumBet: number;
}

export interface RoomView {
    playerId: number;
    canStartRound: boolean;
    params: RoomParameters;
    sitting: number[];
    standing: number[];
    participants: number[];
    isSitting: boolean;
    isStanding: boolean;
    isPlaying: boolean;
    balances: {[playerId: number]: number};
    round: RoundView|null;
}

export interface RoomParameters extends RoundParameters {
    capacity: number;
    autoplayInterval: number;
}

export const defaultRoomParameters: RoomParameters = {
    capacity: CAPACITY.DEFAULT,
    autoplayInterval: AUTOPLAY_INTERVAL.DEFAULT,
    minimumBet: MINIMUM_BET.DEFAULT,
    useBlinds: USE_BLINDS.DEFAULT,
    bigBlindBet: BIG_BLIND_BET.DEFAULT,
    smallBlindBet: SMALL_BLIND_BET.DEFAULT,
    useAntes: USE_ANTES.DEFAULT,
    anteBet: ANTE_BET.DEFAULT,
};

export interface SerialRoom extends RoomParameters {
    sitting: number[];
    standing: number[];
    participants: number[]|null;
    balances: {[playerId: number]: number};
    round: SerialRound;
    dealerIndex: number;
}

type DeckSupplier = () => Card[];

export function getEligiblePlayerIds(
    playerIds: number[], balanceLookup: {[playerId: number]: number},
    permuteBy: number = 0): number[] {
    return permute(playerIds, permuteBy)
        .filter(playerId => playerId !== null && balanceLookup[playerId] > 0);
}

export class Room {

    public balances: {[playerId: number]: number} = {};
    public sitting: number[] = [];
    public standing: number[] = [];
    public participants: number[]|null = null;
    public round: Round|null = null;
    public dealerIndex: number = 0;

    private getDeck: DeckSupplier;
    public params: RoomParameters;

    private constructor() {}
    public static create(params: RoomParameters,
                         getDeck: DeckSupplier = getShuffledDeck): Room {
        if (params.capacity !== Math.round(params.capacity))
            throw new Error(
                `Capacity must be an integer (got ${params.capacity})`);
        if (params.capacity !==
            clamp(CAPACITY.MIN, params.capacity, CAPACITY.MAX))
            throw new Error(`Capacity outside valid range ([${CAPACITY.MIN}, ${
                CAPACITY.MAX}], got ${params.capacity})`);
        const room = new Room();
        room.params = params;
        room.getDeck = getDeck;
        for (let i = 0; i < params.capacity; ++i)
            room.sitting.push(null);
        return room;
    }
    public static deserialize(serial: SerialRoom,
                              getDeck: DeckSupplier = getShuffledDeck): Room {
        const room = new Room();
        room.getDeck = getDeck;
        room.sitting = serial.sitting;
        room.standing = serial.standing;
        room.dealerIndex = serial.dealerIndex;
        room.participants = serial.participants;
        room.balances = serial.balances;
        room.round =
            serial.round === null ? null : Round.deserialize(serial.round);
        room.params = {
            capacity: serial.capacity,
            autoplayInterval: serial.autoplayInterval,
            minimumBet: serial.minimumBet,
            useBlinds: serial.useBlinds,
            bigBlindBet: serial.bigBlindBet,
            smallBlindBet: serial.smallBlindBet,
            useAntes: serial.useAntes,
            anteBet: serial.anteBet,
        };
        return room;
    }
    public serialize(): SerialRoom {
        return {
            sitting: this.sitting,
            standing: this.standing,
            dealerIndex: this.dealerIndex,
            participants: this.participants,
            balances: this.balances,
            round: this.round ? this.round.serialize() : null,
            capacity: this.params.capacity,
            autoplayInterval: this.params.autoplayInterval,
            minimumBet: this.params.minimumBet,
            useBlinds: this.params.useBlinds,
            bigBlindBet: this.params.bigBlindBet,
            smallBlindBet: this.params.smallBlindBet,
            useAntes: this.params.useAntes,
            anteBet: this.params.anteBet,
        };
    }
    public isIn(playerId: number): boolean {
        return this.isPlaying(playerId) || this.isSitting(playerId) ||
               this.isStanding(playerId);
    }
    public isPlaying(playerId: number): boolean {
        return playerId !== null && this.participants !== null &&
               this.participants.indexOf(playerId) !== -1;
    }
    public isSitting(playerId: number): boolean {
        return playerId !== null && this.sitting.indexOf(playerId) !== -1;
    }
    public isStanding(playerId: number): boolean {
        return playerId !== null && this.standing.indexOf(playerId) !== -1;
    }
    public sit(playerId: number, position: number): void {
        if (!this.isStanding(playerId))
            throw new Error(`This player is not standing!`);
        if (this.sitting[position] === undefined)
            throw new Error(`This is not a valid position!`);
        if (this.sitting[position] !== null)
            throw new Error(`There is already somewhere sitting here!`);
        this.standing = this.standing.filter(standingPlayerId =>
                                                 playerId !== standingPlayerId);
        this.sitting[position] = playerId;
    }
    public stand(playerId: number): void {
        if (!this.isSitting(playerId))
            throw new Error(`This player is not sitting!`);
        this.sitting =
            this.sitting.map(sittingPlayerId => ((sittingPlayerId !== null) &&
                                                 playerId === sittingPlayerId)
                                                    ? null
                                                    : sittingPlayerId);
        this.standing.push(playerId);
    }
    public enter(playerId: number): void {
        if (this.balances[playerId] === undefined)
            this.balances[playerId] = 0;
        if (this.isSitting(playerId))
            throw new Error(`This player is already sitting!`);
        if (this.isStanding(playerId))
            throw new Error(`This player is already standing!`);
        this.standing.push(playerId);
    }
    public leave(playerId: number): void {
        if (this.isSitting(playerId)) {
            this.sitting = this.sitting.map(
                sittingPlayerId =>
                    ((sittingPlayerId !== null) && playerId === sittingPlayerId)
                        ? null
                        : sittingPlayerId);
        } else if (this.isStanding(playerId)) {
            this.standing = this.standing.filter(
                standingPlayerId => playerId !== standingPlayerId);
        } else {
            throw new Error(`This player is not in the Room!`);
        }
    }
    public canStartRound(): boolean {
        const eligiblePlayerIds =
            getEligiblePlayerIds(this.sitting, this.balances, this.dealerIndex);
        return (this.round === null || this.round.isFinished) &&
               eligiblePlayerIds.length >= 2;
    }
    public startRound(): Round {
        if (!this.canStartRound())
            throw new Error(`You cannot start a round right now!`);
        const eligiblePlayerIds =
            getEligiblePlayerIds(this.sitting, this.balances, this.dealerIndex);
        const playersAndBalances = eligiblePlayerIds.map(playerId => {
            return {
                id: playerId,
                balance: this.getBalance(playerId),
            };
        });
        this.round =
            Round.create(this.getDeck(), playersAndBalances, this.params);
        this.participants = eligiblePlayerIds;
        this.participants.forEach(playerId => {
            this.balances[playerId] = this.round.getBalance(playerId);
        });
        return this.round;
    }
    public makeBet(playerId: number, bet: Bet, raiseBy: number = 0): void {
        if (this.round === null)
            throw new Error(`There is no round!`);
        if (!this.isPlaying(playerId))
            throw new Error(`This player is not in the current round!`);
        this.round.makeBet(playerId, bet, raiseBy);
        this.balances[playerId] = this.round.getBalance(playerId);
        if (!this.round.isFinished)
            return;
        this.round = null;
        this.participants = null;
        ++this.dealerIndex;
        if (this.dealerIndex === this.params.capacity)
            this.dealerIndex = 0;
    }
    public addBalance(playerId: number, credit: number): void {
        if (!this.isIn(playerId))
            throw new Error(
                "Cannot add balance because player is not at the table!");
        const minCredit = this.params.minimumBet;
        const maxCredit = 100 * this.params.bigBlindBet;
        if (credit !== clamp(minCredit, credit, maxCredit))
            throw new Error(`Can't add balance outside valid range ([${
                minCredit}, ${maxCredit}], got ${credit})`);
        if (this.balances[playerId] == null)
            this.balances[playerId] = 0;
        this.balances[playerId] += credit;
        if (this.isPlaying(playerId))
            this.round.addBalance(playerId, credit);
    }
    public updateParams(params: RoomParameters) { this.params = params; }
    public getBalance(playerId: number): number|null {
        return this.balances[playerId];
    }
    public viewFor(playerId: number): RoomView|null {
        if (!this.isIn(playerId))
            return null;
        let round = null;
        if (this.round !== null) {
            round = {
                minimumBet: this.round.minimumBet,
                communityCards: this.round.communityCards,
                pots: this.round.pots,
                currentIndex: this.round.currentIndex,
                didLastRaiseIndex: this.round.didLastRaiseIndex,
                isFinished: this.round.isFinished,
                playerStates: this.round.playerStates.map(ps => {
                    // pass on everything except the hole cards
                    let playerState = {...ps};
                    if (ps.playerId !== playerId) {
                        playerState.holeCards = null;
                    }
                    return playerState;
                }),
            };
        }
        const v: RoomView = {
            playerId,
            canStartRound: this.canStartRound(),
            params: this.params,
            sitting: this.sitting,
            standing: this.standing,
            participants: this.participants,
            isSitting: this.isSitting(playerId),
            isStanding: this.isStanding(playerId),
            isPlaying: this.isPlaying(playerId),
            balances: this.balances,
            round,
        };
        console.log(JSON.stringify(v, null, 4));
        return v;
    }
};
