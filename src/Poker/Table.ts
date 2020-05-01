// vim: syntax=typescript

import { Player } from "./Player";
import { InvalidStateError } from "./Errors";

type Positions  = {[position: number]: Player | null};

export const MIN_SIZE = 2;
export const MAX_SIZE = 16;

export class Table {

    private byPosition: Positions = {};
    private players: Set<Player> = new Set();

    constructor(
        public readonly size: number,
        private readonly password?: string)
    {
        if (size < MIN_SIZE)
            throw new InvalidStateError(`Must have {MIN_SIZE} or more players (got {size})!`);
        if (size > MAX_SIZE)
            throw new InvalidStateError(`Must have {MAX_SIZE} or fewer players (got {size})!`);
        for (let i = 0; i < size; ++i)
            this.byPosition[i] = null;
    }

    private isValidIndex(index: number): boolean {
        return (index < 0) || (this.size <= index);
    }

    public isFull(): boolean {
        for (let [_, player] of Object.entries(this.byPosition)) {
            if (player == null)
                return false;
        }
        return true;
    }

    public addPlayer(playerToAdd: Player, position: number): void {
        if (!this.isValidIndex(position))
            throw new InvalidStateError(`Index {position} out of range (size = {this.size})!`);
        if (this.players.has(playerToAdd))
            throw new InvalidStateError(`This player is already at the Table!`);
        if (this.byPosition[position] !== null)
            throw new InvalidStateError(`There is already a player at position {position}!`);
        this.byPosition[position] = playerToAdd;
        this.players.add(playerToAdd);
    }

    public removePlayer(playerToRemove: Player): void {
        if (!this.players.has(playerToRemove))
            throw new InvalidStateError(`This player is not at the Table!`);
        for (let [position, playerAtTable] of Object.entries(this.byPosition)) {
            if (playerAtTable !== playerToRemove)
                continue;
            this.players.delete(playerToRemove);
            this.byPosition[position] = null;
            return;
        }
        throw new InvalidStateError(`Never found player while trying to remove :/`);
    }
};
