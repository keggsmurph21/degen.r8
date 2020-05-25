import {Room as RoomObject, RoomSummary} from "Poker/Room";

import {connect} from "../Config/Database";

const INSERT = `
    INSERT INTO Room (secret, capacity, numSitting, numStanding, minimumBet, json)
        VALUES (?, ?, ?, ?, ?, ?)`;

const UPDATE = `
    UPDATE Room
        SET secret = (?),
            capacity = (?),
            numSitting = (?),
            numStanding = (?),
            minimumBet = (?),
            json = (?)
        WHERE id = (?)`;

const BY_ID = `
    SELECT id, secret, capacity, numSitting, numStanding, minimumBet, json
        FROM Room
        WHERE id = (?)`;

const SUMMARIZE_ALL_WITHOUT_SECRET = `
    SELECT id, capacity, numSitting, numStanding, minimumBet
        FROM Room
        WHERE secret IS NULL`;

export namespace RoomModel {

export async function byId(roomId: number,
                           secret: string): Promise<RoomObject|null> {
    const db = await connect();
    const row = await db.get(BY_ID, roomId);
    if (row === undefined)
        return null;
    if (row.secret !== null && row.secret !== secret)
        return null;
    return RoomObject.deserialize(JSON.parse(row.json));
}

export async function summarizeAllWithoutSecret(): Promise<RoomSummary[]> {
    const db = await connect();
    const rows = await db.all(SUMMARIZE_ALL_WITHOUT_SECRET);
    return rows;
}

export async function save(roomId: number, room: RoomObject,
                           secret: string|null): Promise<void> {
    const capacity = room.params.capacity;
    const numSitting = room.sitting.filter(p => p !== null).length;
    const numStanding = room.standing.filter(p => p !== null).length;
    const minimumBet = room.params.minimumBet;
    const json = JSON.stringify(room.serialize());
    const db = await connect();
    await db.run(UPDATE, secret, capacity, numSitting, numStanding, minimumBet,
                 json, roomId);
}

export async function create(room: RoomObject,
                             secret: string|null): Promise<number> {
    const capacity = room.params.capacity;
    const numSitting = room.sitting.filter(p => p !== null).length;
    const numStanding = room.standing.filter(p => p !== null).length;
    const minimumBet = room.params.minimumBet;
    const json = JSON.stringify(room.serialize());
    const db = await connect();
    const {lastID, changes} = await db.run(INSERT, secret, capacity, numSitting,
                                           numStanding, minimumBet, json);
    return lastID;
}
}
