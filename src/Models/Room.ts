import {connect} from "../Config/Database";

import {Room as PokerRoom, SerialRoom as SerialPokerRoom} from "../Poker/Room";

const INSERT = `
    INSERT INTO Room (secret, minimumBet, useBlinds, bigBlindBet, smallBlindBet, useAntes,
                      anteBet, capacity, autoplayInterval, numSitting, numStanding,
                      sittingJson, standingJson, roundJson)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const UPDATE = `
    UPDATE Room
        SET secret = (?),
            minimumBet = (?),
            useBlinds = (?),
            bigBlindBet = (?),
            smallBlindBet = (?),
            useAntes = (?),
            anteBet = (?),
            capacity = (?),
            autoplayInterval = (?),
            numSitting = (?),
            numStanding = (?),
            dealerIndex = (?),
            sittingJson = (?),
            standingJson = (?),
            participantsJson = (?),
            roundJson = (?)
        WHERE id = (?)`;

const BY_ID = `
    SELECT id, secret, minimumBet, useBlinds, bigBlindBet, smallBlindBet, useAntes,
                      anteBet, capacity, autoplayInterval, numSitting, numStanding,
                      dealerIndex, sittingJson, standingJson, participantsJson, roundJson
        FROM Room
        WHERE id = (?)`;

const SUMMARIZE_ALL_WITHOUT_SECRET = `
    SELECT id, numSitting, capacity, numStanding, minimumBet
        FROM Room
        WHERE secret IS NULL`;

export namespace Room {

export async function byId(roomId: number,
                           secret: string): Promise<PokerRoom|null> {
    const db = await connect();
    const row = await db.get(BY_ID, roomId);
    if (row === undefined)
        return null;
    if (row.secret !== null && row.secret !== secret)
        return null;
    return PokerRoom.deserialize({
        sitting: JSON.parse(row.sittingJson),
        standing: JSON.parse(row.standingJson),
        participants: JSON.parse(row.participantsJson),
        round: JSON.parse(row.roundJson),
        dealerIndex: row.dealerIndex,
        capacity: row.capacity,
        autoplayInterval: row.autoplayInterval,
        minimumBet: row.minimumBet,
        useBlinds: row.useBlinds,
        bigBlindBet: row.bigBlindBet,
        smallBlindBet: row.smallBlindBet,
        useAntes: row.useAntes,
        anteBet: row.anteBet,
    });
}

interface RoomSummary {
    id: number, numSitting: number, capacity: number, numStanding: number,
        minimumBet: number,
}

export async function summarizeAllWithoutSecret(): Promise<RoomSummary[]> {
    const db = await connect();
    const rows = await db.all(SUMMARIZE_ALL_WITHOUT_SECRET);
    return rows;
}

export async function save(roomId: number, pokerRoom: PokerRoom,
                           secret: string|null): Promise<number> {
    const serial = pokerRoom.serialize();
    const numSitting = serial.sitting.filter(p => p !== null).length;
    const sittingJson = JSON.stringify(serial.sitting);
    const numStanding = serial.standing.filter(p => p !== null).length;
    const standingJson = JSON.stringify(serial.standing);
    const participantsJson = JSON.stringify(serial.participants);
    const roundJson = JSON.stringify(serial.round);
    const db = await connect();
    const {lastID, changes} = await db.run(
        UPDATE, secret, serial.minimumBet, serial.useBlinds, serial.bigBlindBet,
        serial.smallBlindBet, serial.useAntes, serial.anteBet, serial.capacity,
        serial.autoplayInterval, numSitting, numStanding, serial.dealerIndex,
        sittingJson, standingJson, roundJson, participantsJson, roomId);
    return lastID;
}

export async function create(pokerRoom: PokerRoom,
                             secret: string|null): Promise<number> {
    const serial = pokerRoom.serialize();
    const numSitting = serial.sitting.filter(p => p !== null).length;
    const sittingJson = JSON.stringify(serial.sitting);
    const numStanding = serial.standing.filter(p => p !== null).length;
    const standingJson = JSON.stringify(serial.standing);
    const participantsJson = JSON.stringify(serial.participants);
    const roundJson = JSON.stringify(serial.round);
    const db = await connect();
    const {lastID, changes} = await db.run(
        INSERT, secret, serial.minimumBet, serial.useBlinds, serial.bigBlindBet,
        serial.smallBlindBet, serial.useAntes, serial.anteBet, serial.capacity,
        serial.autoplayInterval, numSitting, numStanding, serial.dealerIndex,
        sittingJson, standingJson, participantsJson, roundJson);
    return lastID;
}
}
