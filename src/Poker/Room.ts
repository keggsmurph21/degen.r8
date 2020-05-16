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

interface RoomView {
    params: RoomParameters;
    sitting: number[];
    standing: number[];
    participants: number[];
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

export class Room {

    private balances: {[playerId: number]: number} = {};
    private sitting: number[] = [];
    private standing: number[] = [];
    private participants: number[]|null = null;
    private round: Round|null = null;
    private dealerIndex: number = 0;

    private getDeck: DeckSupplier;
    private params: RoomParameters;

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
        return playerId !== null && this.participants &&
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
    public startRound(): Round {
        if (this.round !== null && !this.round.isFinished)
            throw new Error(`There is already an ongoing round!`);
        const eligiblePlayers =
            permute(this.sitting, this.dealerIndex)
                .filter(playerId =>
                            playerId !== null && this.balances[playerId] > 0);
        if (eligiblePlayers.length === 0)
            throw new Error(
                `There are no eligible players to start a Round with!`);
        if (eligiblePlayers.length === 1)
            throw new Error(
                `You cannot start a Round with only 1 eligible player!`);
        const playersAndBalances = eligiblePlayers.map(playerId => {
            return {
                id: playerId,
                balance: this.getBalance(playerId),
            };
        });
        this.round =
            Round.create(this.getDeck(), playersAndBalances, this.params);
        this.participants = eligiblePlayers;
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
    public getSitting(): ReadonlyArray<number> { return this.sitting; }
    public getStanding(): ReadonlyArray<number> { return this.standing; }
    public getParticipants(): ReadonlyArray<number> {
        return this.participants;
    }
    public getDealerIndex(): number { return this.dealerIndex; }
    public getRound(): Readonly<Round>|null { return this.round; }
    public getParams(): Readonly<RoomParameters> { return this.params; }
    public getBalance(playerId: number): number|null {
        return this.balances[playerId];
    }
    public viewFor(playerId: number): RoomView|null {
        if (!this.isIn(playerId))
            return null;
        let round = null;
        if (this.round !== null) {
            round = {
                myPlayerState: null,
                otherPlayerStates: [],
                minimumBet: this.round.minimumBet,
                communityCards: this.round.getCommunityCards(),
                pots: this.round.getPots(),
                currentIndex: this.round.getCurrentIndex(),
                didLastRaiseIndex: this.round.getDidLastRaiseIndex(),
                isFinished: this.round.isFinished,
            };
            this.round.getPlayerStates().forEach(ps => {
                if (ps.playerId === playerId) {
                    round.myPlayerState = ps;
                    return;
                }
                const {holeCards, ...otherPlayerState} = ps;
                round.otherPlayerStates.push(otherPlayerState);
            });
        }
        return {
            params: this.params,
            sitting: this.sitting,
            standing: this.standing,
            participants: this.participants,
            balances: this.balances,
            round,
        };
    }
};
