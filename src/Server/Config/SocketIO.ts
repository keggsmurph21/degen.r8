import {Express, Response} from "express";
import {Server} from "http";
import socketio from "socket.io";

import {sessionMiddleware} from "./Session";

export function channelNameFor(roomId: number|null): string {
    return roomId == null ? "lobby" : ("room-" + roomId);
}

export let io: socketio.Server = null;

export function configureSocketIO(server: Server,
                                  setUpHandlers: (socket: socketio.Socket) =>
                                      void): socketio.Server {

    io = socketio(server);

    io.use((socket: socketio.Socket, next) => {
        // Allow socket.io to access express / passport session
        sessionMiddleware(socket.request, {} as Response, next);
    });

    io.on("connection", async (socket: socketio.Socket) => {
        console.log("socket", socket.id, "connected with query",
                    socket.handshake.query);

        if (!socket.request.session.passport ||
            !socket.request.session.passport.user) {
            console.log("WARNING: disconnecting unauthenticated socket",
                        socket.id);
            return socket.disconnect(true);
        }

        const roomId = socket.request.session.roomId;
        const secret = socket.request.session.secret;

        const channel = channelNameFor(roomId);
        socket.request.session.channel = channel;
        socket.request.session.save();

        socket.join(channel);
        console.log("socket", socket.id, "joined channel", channel);

        socket.on("disconnect",
                  () => { console.log("socket", socket.id, "disconnected"); });

        setUpHandlers(socket);
    });

    return io;
}
