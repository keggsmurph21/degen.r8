import {Express, Response} from "express";
import {Server} from "http";
import {Message} from "Interface/Chat";
import {
    CreateRoomRequest,
    CreateRoomResponse,
    JoinRoomRequest,
    QueryRoomsRequest
} from "Interface/Lobby";
import socketio from "socket.io";

import {
    create,
    summarize,
    validateRoomParameters
} from "../Services/RoomService";

import {sessionMiddleware} from "./Session";

async function onQueryRooms(socket: socketio.Socket,
                            data: QueryRoomsRequest): Promise<void> {
    const rooms = await summarize();
    socket.emit("query-rooms", {rooms});
}

async function onJoinRoom(socket: socketio.Socket,
                          data: JoinRoomRequest): Promise<void> {
    // FIXME: Implement
    console.log("onJoinRoom", data);
}

async function onCreateRoom(socket: socketio.Socket, userId: number,
                            data: CreateRoomRequest): Promise<void> {
    let res: CreateRoomResponse;
    try {
        const params = validateRoomParameters(data.params);
        const secret = data.params.secret;
        const [roomId, room] = await create(userId, secret, params);
        socket.request.session.roomId = roomId;
        socket.request.session.secret = secret;
        socket.request.session.save();
        // FIXME: Emit an event to the channel
        res = {error: null, roomId};
    } catch (e) {
        res = {error: e.message, roomId: null};
    }
    socket.emit("create-room", res);
}

function onMessage(socket: socketio.Socket, data: Message, userId: number,
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
        const session = socket.request.session;
        // FIXME: Why is this necessary?
        if (session.connections == null)
            session.connections = 0;
        session.connections++;
        session.save();

        console.log("new connection from", socket.id);

        if (!session.passport || !session.passport.user) {
            console.log("WARNING: disconnecting unauthenticated client");
            return socket.disconnect(true);
        }

        const userId = session.passport.user;
        const roomId = session.roomId;
        const secret = session.secret;

        // global channels
        socket.on("message",
                  data => { onMessage(socket, data, userId, roomId); });

        // lobby channels
        socket.on("query-rooms",
                  async data => { await onQueryRooms(socket, data); });
        socket.on("join-room",
                  async data => { await onJoinRoom(socket, data); });
        socket.on("create-room",
                  async data => { await onCreateRoom(socket, userId, data); });

        // room channels
        // socket.on("make-bet", ...);
        // socket.on("sit", ...);
        // socket.on("stand", ...);
        // socket.on("enter", ...);
        // socket.on("leave", ...);

        socket.on("disconnect", () => {
            // IMPLEMENT ME
            console.log("disconnection from", socket.id);
        });
    });
}
