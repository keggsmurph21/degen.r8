import io from "socket.io-client";

export function connect(): io.Socket {
    const socket = io();
    return socket;
}
