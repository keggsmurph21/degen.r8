import {Form} from "Interface/Lobby";
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
} from "Poker/Defaults";
import {
    Room as RoomObject,
    RoomParameters,
    RoomSummary,
} from "Poker/Room";
import {Bet} from "Poker/Round";

import {RoomModel} from "../Models/RoomModel";

// FIXME: This should probably be in the Room constructor
export function validateRoomParameters(params: Form): RoomParameters {
    const useBlinds = USE_BLINDS.validate(params.useBlinds);
    const useAntes = USE_BLINDS.validate(params.useAntes);
    return {
        minimumBet: MINIMUM_BET.validate(params.minimumBet),
        useBlinds,
        bigBlindBet: params.useBlinds
                         ? BIG_BLIND_BET.validate(params.bigBlindBet)
                         : null,
        smallBlindBet: params.useBlinds
                           ? SMALL_BLIND_BET.validate(params.smallBlindBet)
                           : null,
        useAntes,
        anteBet: params.useAntes ? ANTE_BET.validate(params.anteBet) : null,
        capacity: CAPACITY.validate(params.capacity),
        autoplayInterval: AUTOPLAY_INTERVAL.validate(params.autoplayInterval),
    };
}

export function validateBetType(betString: string): Bet {
    const betType = betString === "fold"
                        ? Bet.Fold
                        : betString === "call"
                              ? Bet.Call
                              : betString === "raise" ? Bet.Raise : null;
    if (betType === null)
        throw new Error(
            `invalid bet type: expected one of 'fold', 'call', 'raise', got '${
                betString}'`);
    return betType;
}

export async function summarize(): Promise<RoomSummary[]> {
    return await RoomModel.summarizeAllWithoutSecret();
}

export async function find(userId: number, roomId: number,
                           secret: string): Promise<RoomObject> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    if (!room.isIn(userId))
        throw new Error("Player is not in room!");
    return room;
}

export async function create(userId: number, secret: string,
                             params: RoomParameters):
    Promise<[number, RoomObject]> {
    const room = await RoomObject.create(params);
    const roomId = await RoomModel.create(room, secret || null);
    room.enter(userId);
    await RoomModel.save(roomId, room, secret || null);
    return [roomId, room];
}

export async function enter(userId: number, roomId: number,
                            secret: string): Promise<RoomObject> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    room.enter(userId);
    console.log(room);
    await RoomModel.save(roomId, room, secret || null);
    return room;
}

export async function leave(userId: number, roomId: number,
                            secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    room.leave(userId);
    await RoomModel.save(roomId, room, secret || null);
}

export async function sit(userId: number, roomId: number, secret: string,
                          seatIndex: number): Promise<void> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    room.sit(userId, seatIndex);
    await RoomModel.save(roomId, room, secret || null);
}

export async function stand(userId: number, roomId: number,
                            secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    room.stand(userId);
    await RoomModel.save(roomId, room, secret || null);
}

export async function startRound(userId: number, roomId: number,
                                 secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    if (!room.isSitting(userId))
        throw new Error("Cannot start round if not sitting!");
    room.startRound();
    await RoomModel.save(roomId, room, secret || null);
}

export async function makeBet(userId: number, roomId: number, secret: string,
                              betType: Bet, raiseBy: number): Promise<void> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    room.makeBet(userId, betType, raiseBy);
    await RoomModel.save(roomId, room, secret || null);
}

export async function addBalance(userId: number, roomId: number, secret: string,
                                 credit: number): Promise<void> {
    const room = await RoomModel.byId(roomId, secret || null);
    if (room === null)
        throw new Error("Room not found!");
    room.addBalance(userId, credit);
    await RoomModel.save(roomId, room, secret || null);
}
