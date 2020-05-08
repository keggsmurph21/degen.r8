import {clamp} from "../Utils";

import {Card} from "./Card";
import {Player} from "./Player";
import {Round, RoundParameters} from "./Round";

export const MIN_CAPACITY = 2;
export const MAX_CAPACITY = 16;

export interface RoomParameters extends RoundParameters {
    capacity: number;
    autoplayInterval: number;
}

type Positions = Array<Player>;
type DeckSupplier = () => Card[];

export class Room {

    private sitting: Positions = [];
    private standing: Set<Player> = new Set();
    private round: Round|null = null;

    private getDeck: DeckSupplier;
    private params: RoomParameters;

    constructor(getDeck: DeckSupplier, params: RoomParameters) {
        if (params.capacity !== Math.round(params.capacity))
            throw new Error(
                `Capacity must be an integer (got ${params.capacity})`);
        if (params.capacity !==
            clamp(MIN_CAPACITY, params.capacity, MAX_CAPACITY))
            throw new Error(`Capacity outside valid range ([${MIN_CAPACITY}, ${
                MAX_CAPACITY}], got ${params.capacity})`);
        this.params = params;
        this.getDeck = getDeck;
        for (let i = 0; i < params.capacity; ++i)
            this.sitting.push(null);
    }
    private isSitting(player: Player): boolean {
        return this.sitting.indexOf(player) !== -1;
    }
    private isStanding(player: Player): boolean {
        return this.standing.has(player);
    }
    public sit(player: Player, position: number): void {
        if (!this.isStanding(player))
            throw new Error(`This player is not standing!`);
        if (this.sitting[position] === undefined)
            throw new Error(`This is not a valid position!`);
        if (this.sitting[position] !== null)
            throw new Error(`There is already somewhere sitting here!`);
        this.standing.delete(player);
        this.sitting[position] = player;
    }
    public stand(player: Player): void {
        if (!this.isSitting(player))
            throw new Error(`This player is not sitting!`);
        this.sitting = this.sitting.map(
            sittingPlayer => (sittingPlayer === player) ? null : sittingPlayer);
        this.standing.add(player);
    }
    public enter(player: Player): void {
        if (this.isSitting(player))
            throw new Error(`This player is already sitting!`);
        if (this.isStanding(player))
            throw new Error(`This player is already standing!`);
        this.standing.add(player);
    }
    public leave(player: Player): void {
        if (this.isSitting(player)) {
            this.sitting = this.sitting.map(
                sittingPlayer =>
                    (sittingPlayer === player) ? null : sittingPlayer);
        } else if (this.isStanding(player)) {
            this.standing.delete(player);
        } else {
            throw new Error(`This player is not in the Room!`);
        }
    }
    public startRound(): Round {
        if (this.round !== null && !this.round.isFinished)
            throw new Error(`There is already an ongoing round!`);
        const eligiblePlayers = this.sitting.filter(
            player => player !== null && player.balance > 0);
        if (eligiblePlayers.length === 0)
            throw new Error(
                `There are no eligible players to start a Round with!`);
        if (eligiblePlayers.length < 2)
            throw new Error(
                `You cannot start a Round with only 1 eligible player!`);
        this.round = new Round(this.getDeck(), eligiblePlayers, this.params);
        return this.round;
    }
    public updateParams(params: RoomParameters) { this.params = params; }
    public getSitting(): Readonly<Positions> { return this.sitting; }
    public getStanding(): Readonly<Set<Player>> { return this.standing; }
    public getRound(): Readonly<Round>|null { return this.round; }
    public getParams(): Readonly<RoomParameters> { return this.params; }
};
