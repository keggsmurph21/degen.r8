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
import {UserModel} from "../Models/UserModel";

// FIXME: This should probably be in the Room constructor
export function validateRoomParameters(params: {
    minimumBet: any,
    useBlinds: any,
    bigBlindBet: any,
    smallBlindBet: any,
    useAntes: any,
    anteBet: any,
    capacity: any,
    autoplayInterval: any,
}): RoomParameters {
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

export async function find(user: UserModel, roomId: number,
                           secret: string): Promise<RoomObject> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    if (!room.isIn(user.id))
        throw new Error("Player is not in room!");
    return room;
}

export async function create(user: UserModel, secret: string,
                             params: RoomParameters):
    Promise<[number, RoomObject]> {
    const room = await RoomObject.create(params);
    const roomId = await RoomModel.create(room, secret);
    room.enter(user.id);
    await RoomModel.save(roomId, room, secret);
    return [roomId, room];
}

export async function enter(user: UserModel, roomId: number,
                            secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    room.enter(user.id);
    await RoomModel.save(roomId, room, secret);
}

export async function leave(user: UserModel, roomId: number,
                            secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    room.leave(user.id);
    await RoomModel.save(roomId, room, secret);
}

export async function sit(user: UserModel, roomId: number, secret: string,
                          seatIndex: number): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    room.sit(user.id, seatIndex);
    await RoomModel.save(roomId, room, secret);
}

export async function stand(user: UserModel, roomId: number,
                            secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    room.stand(user.id);
    await RoomModel.save(roomId, room, secret);
}

export async function startRound(user: UserModel, roomId: number,
                                 secret: string): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    if (!room.isSitting(user.id))
        throw new Error("Cannot start round if not sitting!");
    room.startRound();
    await RoomModel.save(roomId, room, secret);
}

export async function makeBet(user: UserModel, roomId: number, secret: string,
                              betType: Bet, raiseBy: number): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    room.makeBet(user.id, betType, raiseBy);
    await RoomModel.save(roomId, room, secret);
}

export async function addBalance(user: UserModel, roomId: number,
                                 secret: string,
                                 credit: number): Promise<void> {
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        throw new Error("Room not found!");
    room.addBalance(user.id, credit);
    await RoomModel.save(roomId, room, secret);
}
