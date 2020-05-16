import {Room as RoomModel, RoomSummary} from "../Models/Room";
import {User as UserModel} from "../Models/User";
import {
    MAX_CAPACITY,
    MIN_CAPACITY,
    Room as RoomObject,
    RoomParameters,
} from "../Poker/Room";
import {Bet} from "../Poker/Round";

// FIXME: These should live elsewhere
export const MIN_BET = 0.00;
export const MAX_BET = 100.00;
export const MIN_AUTOPLAY_INTERVAL = 0;
export const MAX_AUTOPLAY_INTERVAL = 60;

export function validateFloat(parameterName: string, rawValue: any,
                              minValue: number, maxValue: number,
                              decimalPrecision: number = 2): number {
    const offset = 10 ** decimalPrecision;
    const value =
        Math.round((parseFloat(rawValue) + Number.EPSILON) * offset) / offset;
    if (isNaN(value))
        throw new Error(
            `invalid ${parameterName}: value '${rawValue}' is not a number`);
    if (value < minValue || maxValue < value)
        throw new Error(`invalid ${parameterName}: value '${
            rawValue}' is outside range ${minValue} to ${maxValue}`);
    return value;
}

export function validateInt(parameterName: string, rawValue: any,
                            minValue: number, maxValue: number): number {
    const value = parseInt(rawValue);
    if (isNaN(value))
        throw new Error(
            `invalid ${parameterName}: value '${rawValue}' is not a number`);
    if (value < minValue || maxValue < value)
        throw new Error(`invalid ${parameterName}: value '${
            rawValue}' is outside range ${minValue} to ${maxValue}`);
    return value;
}

// FIXME: Move this validation logic elsewhere -- into Poker/Room maybe?
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
    // NB: By default, checkboxes will send "on" for values that are
    // checked!
    const useBlinds = params.useBlinds === "on" ? true : !!params.useBlinds;
    const useAntes = params.useAntes === "on" ? true : !!params.useAntes;
    return {
        minimumBet:
            validateFloat("minimumBet", params.minimumBet, MIN_BET, MAX_BET),
        useBlinds,
        bigBlindBet: params.useBlinds
                         ? validateFloat("bigBlindBet", params.bigBlindBet,
                                         MIN_BET, MAX_BET)
                         : null,
        smallBlindBet: params.useBlinds ? validateFloat("smallBlindBet",
                                                        params.smallBlindBet,
                                                        MIN_BET, MAX_BET)
                                        : null,
        useAntes,
        anteBet: params.useAntes ? validateFloat("anteBet", params.anteBet,
                                                 MIN_BET, MAX_BET)
                                 : null,
        capacity: validateInt("capacity", params.capacity, MIN_CAPACITY,
                              MAX_CAPACITY),
        autoplayInterval:
            validateInt("autoplayInterval", params.autoplayInterval,
                        MIN_AUTOPLAY_INTERVAL, MAX_AUTOPLAY_INTERVAL),
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
