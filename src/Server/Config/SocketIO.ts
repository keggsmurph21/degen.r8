import {Express, Response} from "express";
import {Server} from "http";
import {Message} from "Interface/Chat";
import {
    CreateRoomRequest,
    CreateRoomResponse,
    JoinRoomRequest,
    JoinRoomResponse,
    NewRoom,
    QueryRoomsRequest,
    UpdateRoom,
} from "Interface/Lobby";
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
import socketio from "socket.io";

import {
    addBalance,
    create,
    enter,
    leave,
    makeBet,
    sit,
    stand,
    summarize,
    validateRoomParameters
} from "../Services/RoomService";

import {sessionMiddleware} from "./Session";

async function onQueryRooms(io: socketio.Server, socket: socketio.Socket,
                            data: QueryRoomsRequest): Promise<void> {
    const rooms = await summarize();
    socket.emit("query-rooms", {rooms});
}

async function onJoinRoom(io: socketio.Server, socket: socketio.Socket,
                          data: JoinRoomRequest): Promise<void> {
    console.log("onJoin", data);
    let res: JoinRoomResponse;
    try {
        const userId = socket.request.session.passport.user;
        const roomId = data.roomId;
        const secret = data.secret;
        const room = await enter(userId, roomId, secret);
        socket.request.session.roomId = roomId;
        socket.request.session.secret = secret;
        socket.request.session.save();
        if (!secret) {
            const updateRoomData: UpdateRoom = {
                id: roomId,
                capacity: room.params.capacity,
                numSitting: room.sitting.filter(p => p !== null).length,
                numStanding: room.standing.filter(p => p !== null).length,
                minimumBet: room.params.minimumBet,
            };
            io.to("lobby").emit("update-room", updateRoomData);
        }
        res = {error: null, roomId};
    } catch (e) {
        res = {error: e.message, roomId: null};
    }
    socket.emit("join-room", res);
}

async function onCreateRoom(io: socketio.Server, socket: socketio.Socket,
                            data: CreateRoomRequest): Promise<void> {
    let res: CreateRoomResponse;
    try {
        const params = validateRoomParameters(data.params);
        const userId = socket.request.session.passport.user;
        const secret = data.params.secret;
        const [roomId, room] = await create(userId, secret, params);
        socket.request.session.roomId = roomId;
        socket.request.session.secret = secret;
        socket.request.session.save();
        if (!secret) {
            const newRoomData: NewRoom = {
                id: roomId,
                capacity: room.params.capacity,
                numSitting: room.sitting.filter(p => p !== null).length,
                numStanding: room.standing.filter(p => p !== null).length,
                minimumBet: room.params.minimumBet,
            };
            io.to("lobby").emit("new-room", newRoomData);
        }
        res = {error: null, roomId};
    } catch (e) {
        res = {error: e.message, roomId: null};
    }
    socket.emit("create-room", res);
}

async function onSit(io: socketio.Server, socket: socketio.Socket,
                     data: SitRequest): Promise<void> {
    console.log("onSit", data);
    let res: RoomResponse;
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const seatIndex = data.seatIndex;
        const room = await sit(userId, roomId, secret, seatIndex);
        res = {error: null, view: room.viewFor(userId)};
    } catch (e) {
        res = {error: e.message, view: null};
    }
    socket.emit("room-changed", res);
}

async function onStand(io: socketio.Server, socket: socketio.Socket,
                       data: StandRequest): Promise<void> {
    // FIXME: Implement
    console.log("onStand", data);
}

async function onLeave(io: socketio.Server, socket: socketio.Socket,
                       data: LeaveRequest): Promise<void> {
    // FIXME: Implement
    console.log("onLeave", data);
}

async function onStart(io: socketio.Server, socket: socketio.Socket,
                       data: StartRequest): Promise<void> {
    // FIXME: Implement
    console.log("onStart", data);
}

async function onAddBalance(io: socketio.Server, socket: socketio.Socket,
                            data: AddBalanceRequest): Promise<void> {
    console.log("onAddBalance", data);
    let res: RoomResponse;
    try {
        const userId = socket.request.session.passport.user;
        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;
        const credit = data.credit;
        const room = await addBalance(userId, roomId, secret, credit);
        res = {error: null, view: room.viewFor(userId)};
    } catch (e) {
        res = {error: e.message, view: null};
    }
    socket.emit("room-changed", res);
}

async function onFold(io: socketio.Server, socket: socketio.Socket,
                      data: FoldRequest): Promise<void> {
    // FIXME: Implement
    console.log("onFold", data);
}

async function onCall(io: socketio.Server, socket: socketio.Socket,
                      data: CallRequest): Promise<void> {
    // FIXME: Implement
    console.log("onCall", data);
}

async function onRaise(io: socketio.Server, socket: socketio.Socket,
                       data: RaiseRequest): Promise<void> {
    // FIXME: Implement
    console.log("onRaise", data);
}

function onMessage(io: socketio.Server, socket: socketio.Socket,
                   data: Message): void {
    // FIXME: Implement
    console.log("onMessage", data);
}

export function configureSocketIO(server: Server): void {
    const io = socketio(server);

    io.use((socket: socketio.Socket, next) => {
        // Allow socket.io to access express / passport session
        sessionMiddleware(socket.request, {} as Response, next);
    });

    io.on("connection", async (socket: socketio.Socket) => {
        /*
        const session = socket.request.session;
        // FIXME: Why is this necessary?
        if (session.connections == null)
            session.connections = 0;
        session.connections++;
        session.save();
         */

        console.log("socket", socket.id, "connected with query",
                    socket.handshake.query);

        if (!socket.request.session.passport ||
            !socket.request.session.passport.user) {
            console.log("WARNING: disconnecting unauthenticated socket",
                        socket.id);
            return socket.disconnect(true);
        }

        const roomId = socket.handshake.query.roomId;
        const secret = socket.request.session.secret;

        const channel = roomId ? ("room-" + roomId) : "lobby";
        socket.request.session.channel = channel;
        socket.request.session.save();

        socket.join(channel);
        console.log("socket", socket.id, "joined channel", channel);

        // global channels
        socket.on("message", data => { onMessage(io, socket, data); });

        // lobby channels
        socket.on("query-rooms",
                  async data => { await onQueryRooms(io, socket, data); });
        socket.on("join-room",
                  async data => { await onJoinRoom(io, socket, data); });
        socket.on("create-room",
                  async data => { await onCreateRoom(io, socket, data); });

        // room channels
        socket.on("sit", async data => { await onSit(io, socket, data); });
        socket.on("stand", async data => { await onStand(io, socket, data); });
        socket.on("leave", async data => { await onLeave(io, socket, data); });
        socket.on("start", async data => { await onStart(io, socket, data); });
        socket.on("add-balance",
                  async data => { await onAddBalance(io, socket, data); });
        socket.on("fold", async data => { await onFold(io, socket, data); });
        socket.on("call", async data => { await onCall(io, socket, data); });
        socket.on("raise", async data => { await onRaise(io, socket, data); });

        socket.on("disconnect",
                  () => { console.log("socket", socket.id, "disconnected"); });
    });
}
