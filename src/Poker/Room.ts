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

type Positions = {
    [position: number]: Player|null
};

type DeckSupplier = () => Card[];

export class Room {

    private sitting: Positions = {};
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
            this.sitting[i] = null;
    }

    public sit(player: Player): void {}
    public stand(player: Player): void {}
    public enter(player: Player): void {
        if (Object.values(this.sitting)
                .filter(sittingPlayer => sittingPlayer !== null)
                .reduce((alreadySitting, sittingPlayer) =>
                            alreadySitting || (player === sittingPlayer),
                        false)) {
            throw new Error(`This player is already sitting!`);
        }
        if (this.standing.has(player)) {
            throw new Error(`This player is already standing!`);
        }
        this.standing.add(player);
    }
    public leave(player: Player): void {}
    public startRound(): Round {
        this.round = new Round(
            this.getDeck(),
            Object.values(this.sitting)
                .filter(player => player !== null && player.balance > 0),
            this.params);
        return this.round;
    }

    public getSitting(): Readonly<Positions> { return this.sitting; }
    public getStanding(): Readonly<Set<Player>> { return this.standing; }
    public getRound(): Readonly<Round>|null { return this.round; }
    public getParams(): Readonly<RoomParameters> { return this.params; }
};
