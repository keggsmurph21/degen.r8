import {
    AddBalanceRequest,
    CallRequest,
    FoldRequest,
    LeaveRequest,
    RaiseRequest,
    RoomResponse,
    SitRequest,
    StandRequest,
    StartRequest,
} from "Interface/Room";
import {Room} from "Poker/Room";
import {Bet} from "Poker/Round";
import socketio from "socket.io";

import {channelNameFor} from "../Config/SocketIO";
import {io} from "../Config/SocketIO";
import {
    addBalance,
    leave,
    makeBet,
    sit,
    stand,
    startRound,
} from "../Services/RoomService";

function broadcastRoomView(roomId: number, room: Room): void {
    io.in(channelNameFor(roomId)).clients((err: any, clients: number[]) => {
        if (err)
            throw err;
        clients.forEach((socketId: number) => {
            const socket = io.sockets.connected[socketId];
            const userId = socket.request.session.passport.user;
            const res: RoomResponse = {
                error: null,
                view: room.viewFor(userId),
            };
            socket.emit("room-changed", res);
        });
    });
}

export async function onSit(socket: socketio.Socket,
                            data: SitRequest): Promise<void> {
    console.log("onSit", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const seatIndex = data.seatIndex;
        const room = await sit(userId, roomId, secret, seatIndex);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onStand(socket: socketio.Socket,
                              data: StandRequest): Promise<void> {
    console.log("onStand", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const room = await stand(userId, roomId, secret);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onLeave(socket: socketio.Socket,
                              data: LeaveRequest): Promise<void> {
    console.log("onLeave", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const room = await leave(userId, roomId, secret);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onStart(socket: socketio.Socket,
                              data: StartRequest): Promise<void> {
    console.log("onStart", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const room = await startRound(userId, roomId, secret);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onAddBalance(socket: socketio.Socket,
                                   data: AddBalanceRequest): Promise<void> {
    console.log("onAddBalance", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const credit = data.credit;
        const room = await addBalance(userId, roomId, secret, credit);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onFold(socket: socketio.Socket,
                             data: FoldRequest): Promise<void> {
    console.log("onFold", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const room = await makeBet(userId, roomId, secret, Bet.Fold, 0);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onCall(socket: socketio.Socket,
                             data: CallRequest): Promise<void> {
    console.log("onCall", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const room = await makeBet(userId, roomId, secret, Bet.Call, 0);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

export async function onRaise(socket: socketio.Socket,
                              data: RaiseRequest): Promise<void> {
    console.log("onRaise", data);
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const raiseBy = data.raiseBy;
        const room = await makeBet(userId, roomId, secret, Bet.Raise, raiseBy);
        broadcastRoomView(roomId, room);
    } catch (e) {
        const res: RoomResponse = {error: e.message, view: null};
        socket.emit("room-changed", res);
    }
}

