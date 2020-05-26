import io from "socket.io-client";

export function connect(): SocketIOClient.Socket {
    const socket = io();
    return socket;
}
