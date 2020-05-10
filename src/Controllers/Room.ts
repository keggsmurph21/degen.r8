import {Request, Response} from "express";

import {Room as RoomModel} from "../Models/Room";
import {UserModel} from "../Models/User";
import {Player} from "../Poker/Player";
import {MAX_CAPACITY, MIN_CAPACITY, Room as PokerRoom} from "../Poker/Room";
import {Bet} from "../Poker/Round";

const MIN_BET = 0.00;
const MAX_BET = 100.00;
const MIN_AUTOPLAY_INTERVAL = 0;
const MAX_AUTOPLAY_INTERVAL = 60;

function validateFloat(parameterName: string, rawValue: any, minValue: number,
                       maxValue: number, decimalPrecision: number = 2): number {
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

function validateInt(parameterName: string, rawValue: any, minValue: number,
                     maxValue: number): number {
    const value = parseInt(rawValue);
    if (isNaN(value))
        throw new Error(
            `invalid ${parameterName}: value '${rawValue}' is not a number`);
    if (value < minValue || maxValue < value)
        throw new Error(`invalid ${parameterName}: value '${
            rawValue}' is outside range ${minValue} to ${maxValue}`);
    return value;
}

export namespace roomController {

export const getLobby = async (req: Request, res: Response) => {
    const availableRooms = await RoomModel.summarizeAllWithoutSecret();
    res.render("lobby", {isLoggedIn: true, availableRooms});
};

export const getRoom = async (req: Request, res: Response) => {
    const roomId = parseInt(req.query.r as any);
    const secret = (req.query.s as string || "").toString() || null;
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    res.render("room", {
        isLoggedIn: true,
        roomId,
        player,
        secret,
        room: room.viewFor(player as Player)
    });
};

export const postCreate = async (req: Request, res: Response) => {
    let minimumBet, useBlinds, bigBlindBet, smallBlindBet, useAntes, anteBet,
        capacity, autoplayInterval;
    const secret = req.body.secret || null;
    try {
        minimumBet =
            validateFloat("minimumBet", req.body.minimumBet, MIN_BET, MAX_BET);
        useBlinds = req.body.useBlinds === "on";
        bigBlindBet = useBlinds
                          ? validateFloat("bigBlindBet", req.body.bigBlindBet,
                                          MIN_BET, MAX_BET)
                          : null;
        smallBlindBet =
            useBlinds ? validateFloat("smallBlindBet", req.body.smallBlindBet,
                                      MIN_BET, MAX_BET)
                      : null;
        useAntes = req.body.useAntes === "on";
        anteBet = useAntes ? validateFloat("anteBet", req.body.anteBet, MIN_BET,
                                           MAX_BET)
                           : null;
        capacity = validateInt("capacity", req.body.capacity, MIN_CAPACITY,
                               MAX_CAPACITY);
        autoplayInterval =
            validateInt("autoplayInterval", req.body.autoplayInterval,
                        MIN_AUTOPLAY_INTERVAL, MAX_AUTOPLAY_INTERVAL);
    } catch (e) {
        req.flash("errors", e.message);
        return res.redirect("/lobby.do");
    }
    const pokerRoom = PokerRoom.create({
        capacity,
        autoplayInterval,
        minimumBet,
        useBlinds,
        bigBlindBet,
        smallBlindBet,
        useAntes,
        anteBet,
    });
    pokerRoom.enter(req.user as Player);
    const roomId = await RoomModel.create(pokerRoom, secret);
    res.redirect(`/room.do?r=${roomId}&s=${secret || ""}`);
};

export const postEnter = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.roomId as any);
    const secret = req.body.secret || null;
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    try {
        room.enter(req.user as Player);
    } catch (e) {
        console.log(e);
        req.flash("errors", e.message);
    }
    await RoomModel.save(roomId, room, secret);
    res.redirect(`/room.do?r=${roomId}&s=${secret || ""}`);
};

export const postLeave = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.roomId as any);
    const secret = (req.body.secret as string || "").toString() || null;
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    try {
        room.leave(player as Player);
        console.log(room);
    } catch (e) {
        console.log(e);
        req.flash("errors", e.message);
    }
    await RoomModel.save(roomId, room, secret);
    res.redirect(`/lobby.do`);
};

export const postSit = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.roomId as any);
    const secret = (req.body.secret as string || "").toString() || null;
    const seatIndex = parseInt(req.body.seatIndex as any);
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    try {
        room.sit(player as Player, seatIndex);
    } catch (e) {
        console.log(e);
        req.flash("errors", e.message);
    }
    await RoomModel.save(roomId, room, secret);
    res.redirect(`/room.do?r=${roomId}&s=${secret || ""}`);
};

export const postStand = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.roomId as any);
    const secret = (req.body.secret as string || "").toString() || null;
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    try {
        room.stand(player as Player);
    } catch (e) {
        console.log(e);
        req.flash("errors", e.message);
    }
    await RoomModel.save(roomId, room, secret);
    res.redirect(`/room.do?r=${roomId}&s=${secret || ""}`);
};

export const postStartRound = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.roomId as any);
    const secret = (req.body.secret as string || "").toString() || null;
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    if (!room.getSitting().reduce(
            (alreadyFound, sittingPlayer) =>
                alreadyFound || Player.eq(player as Player, sittingPlayer),
            false)) {
        return res.sendStatus(403);
    }
    try {
        room.startRound();
    } catch (e) {
        console.log(e);
        req.flash("errors", e.message);
    }
    await RoomModel.save(roomId, room, secret);
    res.redirect(`/room.do?r=${roomId}&s=${secret || ""}`);
};

export const postBet = async (req: Request, res: Response) => {
    const roomId = parseInt(req.params.roomId as any);
    const secret = (req.body.secret as string || "").toString() || null;
    const room = await RoomModel.byId(roomId, secret);
    if (room === null)
        return res.sendStatus(404);
    const user = req.user as UserModel;
    const {passwordHash, ...player} = user;
    if (!room.getSitting().reduce(
            (alreadyFound, sittingPlayer) =>
                alreadyFound || Player.eq(player as Player, sittingPlayer),
            false)) {
        return res.sendStatus(403);
    }
    const betType = req.body.betType === "fold"
                        ? Bet.Fold
                        : req.body.betType === "call"
                              ? Bet.Call
                              : req.body.betType === "raise" ? Bet.Raise : null;
    if (betType === null)
        return res.sendStatus(400);
    let raiseBy = 0;
    if (betType === Bet.Raise) {
        try {
            raiseBy =
                validateFloat("raiseBy", req.body.raiseBy, MIN_BET, MAX_BET);
        } catch (e) {
            console.log(e);
            return res.sendStatus(400);
        }
    }
    try {
        room.getRound().makeBet(player as Player, betType, raiseBy);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
    await RoomModel.save(roomId, room, secret);
    res.redirect(`/room.do?r=${roomId}&s=${secret || ""}`);
};

}
