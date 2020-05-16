import {connect} from "../Config/Database";

import {Room as PokerRoom, SerialRoom as SerialPokerRoom} from "../Poker/Room";

const INSERT = `
    INSERT INTO Room (secret, capacity, numSitting, numStanding, json)
        VALUES (?, ?, ?, ?, ?)`;

const UPDATE = `
    UPDATE Room
        SET secret = (?),
            capacity = (?),
            numSitting = (?),
            numStanding = (?),
            json = (?)
        WHERE id = (?)`;

const BY_ID = `
    SELECT id, secret, capacity, numSitting, numStanding, json
        FROM Room
        WHERE id = (?)`;

const SUMMARIZE_ALL_WITHOUT_SECRET = `
    SELECT id, capacity, numSitting, numStanding
        FROM Room
        WHERE secret IS NULL`;

export interface RoomSummary {
    id: number;
    numSitting: number;
    capacity: number;
    numStanding: number;
    minimumBet: number;
}

export namespace Room {

export async function byId(roomId: number,
                           secret: string): Promise<PokerRoom|null> {
    const db = await connect();
    const row = await db.get(BY_ID, roomId);
    if (row === undefined)
        return null;
    if (row.secret !== null && row.secret !== secret)
        return null;
    return PokerRoom.deserialize(JSON.parse(row.json));
}

export async function summarizeAllWithoutSecret(): Promise<RoomSummary[]> {
    const db = await connect();
    const rows = await db.all(SUMMARIZE_ALL_WITHOUT_SECRET);
    return rows;
}

export async function save(roomId: number, pokerRoom: PokerRoom,
                           secret: string|null): Promise<void> {
    const capacity = pokerRoom.getParams().capacity;
    const numSitting = pokerRoom.getSitting().filter(p => p !== null).length;
    const numStanding = pokerRoom.getStanding().filter(p => p !== null).length;
    const json = JSON.stringify(pokerRoom.serialize());
    const db = await connect();
    await db.run(UPDATE, secret, capacity, numSitting, numStanding, json,
                 roomId);
}

export async function create(pokerRoom: PokerRoom,
                             secret: string|null): Promise<number> {
    const capacity = pokerRoom.getParams().capacity;
    const numSitting = pokerRoom.getSitting().filter(p => p !== null).length;
    const numStanding = pokerRoom.getStanding().filter(p => p !== null).length;
    const json = JSON.stringify(pokerRoom.serialize());
    const db = await connect();
    const {lastID, changes} =
        await db.run(INSERT, secret, capacity, numSitting, numStanding, json);
    return lastID;
}

}
