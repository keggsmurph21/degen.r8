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
import socketio from "socket.io";

import {
    create,
    enter,
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

function onMessage(socket: socketio.Socket, data: Message,
                   roomId: number): void {
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
        socket.on("message", data => { onMessage(socket, data, roomId); });

        // lobby channels
        socket.on("query-rooms",
                  async data => { await onQueryRooms(io, socket, data); });
        socket.on("join-room",
                  async data => { await onJoinRoom(io, socket, data); });
        socket.on("create-room",
                  async data => { await onCreateRoom(io, socket, data); });

        // room channels
        // socket.on("make-bet", ...);
        // socket.on("sit", ...);
        // socket.on("stand", ...);
        // socket.on("enter", ...);
        // socket.on("leave", ...);

        socket.on("disconnect",
                  () => { console.log("socket", socket.id, "disconnected"); });
    });
}
