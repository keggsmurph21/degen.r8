import {clamp, findFirst, permute} from "../Utils";
import {Card, getShuffledDeck} from "./Card";
import {
    Bet,
    Player,
    Round,
    RoundParameters,
    RoundView,
    SerialRound
} from "./Round";

export const MIN_CAPACITY = 2;
export const MAX_CAPACITY = 16;

interface RoomView {
    params: RoomParameters;
    sitting: Player[];
    standing: Player[];
    round: RoundView|null;
}

export interface RoomParameters extends RoundParameters {
    capacity: number;
    autoplayInterval: number;
}

export interface SerialRoom extends RoomParameters {
    sitting: Player[];
    standing: Player[];
    round: SerialRound;
    dealerIndex: number;
    participants: Player[]|null;
}

type DeckSupplier = () => Card[];

export class Room {

    private sitting: Player[] = [];
    private standing: Player[] = [];
    // An array of the Players that are in the current round
    private participants: Player[]|null = null;
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
            clamp(MIN_CAPACITY, params.capacity, MAX_CAPACITY))
            throw new Error(`Capacity outside valid range ([${MIN_CAPACITY}, ${
                MAX_CAPACITY}], got ${params.capacity})`);
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
        room.sitting = serial.sitting.slice();
        room.standing = serial.standing.slice();
        room.dealerIndex = serial.dealerIndex;
        room.participants =
            serial.participants ? serial.participants.slice() : null;
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
            sitting: this.sitting.slice(),
            standing: this.standing.slice(),
            dealerIndex: this.dealerIndex,
            participants: this.participants ? this.participants.slice() : null,
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
    private isSitting(player: Player): boolean {
        return findFirst(this.sitting, p => p && p.id === player.id) !== null;
    }
    private isStanding(player: Player): boolean {
        return findFirst(this.standing, p => p && p.id === player.id) !== null;
    }
    public sit(player: Player, position: number): void {
        if (!this.isStanding(player))
            throw new Error(`This player is not standing!`);
        if (this.sitting[position] === undefined)
            throw new Error(`This is not a valid position!`);
        if (this.sitting[position] !== null)
            throw new Error(`There is already somewhere sitting here!`);
        this.standing = this.standing.filter(
            standingPlayer => player.id !== standingPlayer.id);
        this.sitting[position] = player;
    }
    public stand(player: Player): void {
        if (!this.isSitting(player))
            throw new Error(`This player is not sitting!`);
        this.sitting = this.sitting.map(
            sittingPlayer => (sittingPlayer && player.id === sittingPlayer.id)
                                 ? null
                                 : sittingPlayer);
        this.standing.push(player);
    }
    public enter(player: Player): void {
        if (this.isSitting(player))
            throw new Error(`This player is already sitting!`);
        if (this.isStanding(player))
            throw new Error(`This player is already standing!`);
        this.standing.push(player);
    }
    public leave(player: Player): void {
        if (this.isSitting(player)) {
            this.sitting = this.sitting.map(
                sittingPlayer =>
                    (sittingPlayer && player.id === sittingPlayer.id)
                        ? null
                        : sittingPlayer);
        } else if (this.isStanding(player)) {
            this.standing = this.standing.filter(
                standingPlayer => player.id !== standingPlayer.id);
        } else {
            throw new Error(`This player is not in the Room!`);
        }
    }
    public startRound(): Round {
        if (this.round !== null && !this.round.isFinished)
            throw new Error(`There is already an ongoing round!`);
        const eligiblePlayers =
            permute(this.sitting, this.dealerIndex)
                .filter(player => player !== null && player.balance > 0);
        if (eligiblePlayers.length === 0)
            throw new Error(
                `There are no eligible players to start a Round with!`);
        if (eligiblePlayers.length === 1)
            throw new Error(
                `You cannot start a Round with only 1 eligible player!`);
        this.round = Round.create(this.getDeck(), eligiblePlayers, this.params);
        this.participants = eligiblePlayers;
        this.participants.forEach(participant => {
            participant.balance = this.round.getBalance(participant.id);
        });
        return this.round;
    }
    public makeBet(player: Player, bet: Bet, raiseBy: number = 0): void {
        if (this.round === null)
            throw new Error(`There is no round!`);
        const participant =
            findFirst(this.participants, p => p && p.id === player.id);
        if (participant === null)
            throw new Error(`This player is not in the current round!`);
        this.round.makeBet(participant.id, bet, raiseBy);
        participant.balance = this.round.getBalance(participant.id);
        if (!this.round.isFinished)
            return;
        this.round = null;
        this.participants = null;
        ++this.dealerIndex;
        if (this.dealerIndex === this.params.capacity)
            this.dealerIndex = 0;
    }
    public updateParams(params: RoomParameters) { this.params = params; }
    public getSitting(): ReadonlyArray<Player> { return this.sitting; }
    public getStanding(): ReadonlyArray<Player> { return this.standing; }
    public getParticipants(): ReadonlyArray<Player> {
        return this.participants;
    }
    public getDealerIndex(): number { return this.dealerIndex; }
    public getRound(): Readonly<Round>|null { return this.round; }
    public getParams(): Readonly<RoomParameters> { return this.params; }
    public viewFor(player: Player): RoomView|null {
        if (!this.isSitting(player) && !this.isStanding(player))
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
                if (ps.playerId === player.id) {
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
            round,
        };
    }
};
