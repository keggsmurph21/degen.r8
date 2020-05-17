import {Request, Response} from "express";
import {PARAMS} from "Poker/Defaults";

import {RoomModel} from "../Models/RoomModel";
import {UserModel} from "../Models/UserModel";
import {
    addBalance,
    create,
    enter,
    find,
    leave,
    makeBet,
    sit,
    stand,
    startRound,
    summarize,
    validateBetType,
    validateRoomParameters,
} from "../Services/RoomService";

export const getLobby = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    try {
        const availableRooms = await summarize();
        res.render("lobby", {
            user: {id: user.id, name: user.name},
            availableRooms,
            params: PARAMS,
        });
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/register.do");
    }
};

export const getRoom = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    try {
        const room = await find(user, roomId, secret);
        res.render("room", {
            user: {id: user.id, name: user.name},
            roomId,
            secret,
            capacity: room.getParams().capacity,
        });
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postCreate = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const secret = req.session.secret;
    try {
        const params = validateRoomParameters({
            minimumBet: req.body.minimumBet,
            useBlinds: req.body.useBlinds,
            bigBlindBet: req.body.bigBlindBet,
            smallBlindBet: req.body.smallBlindBet,
            useAntes: req.body.useAntes,
            anteBet: req.body.anteBet,
            capacity: req.body.capacity,
            autoplayInterval: req.body.autoplayInterval,
        });
        const [roomId, room] = await create(user, secret, params);
        req.session.roomId = roomId;
        req.session.secret = secret;
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postEnter = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    try {
        await enter(user, roomId, secret);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postLeave = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    try {
        await leave(user, roomId, secret);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postSit = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    const seatIndex = parseInt(req.body.seatIndex as any);
    try {
        await sit(user, roomId, secret, seatIndex);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postStand = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    try {
        await stand(user, roomId, secret);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postStartRound = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    try {
        await startRound(user, roomId, secret);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postBet = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    const betType = validateBetType(req.body.betType);
    const raiseBy = parseFloat(req.body.raiseBy);
    try {
        await makeBet(user, roomId, secret, betType, raiseBy);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};

export const postAddBalance = async (req: Request, res: Response) => {
    const user = req.user as UserModel;
    const roomId = req.session.roomId;
    const secret = req.session.secret;
    const credit = parseFloat(req.body.credit);
    try {
        await addBalance(user, roomId, secret, credit);
        res.redirect("/room.do");
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/lobby.do");
    }
};
