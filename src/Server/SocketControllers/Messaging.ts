import {Message} from "Interface/Chat";
import socketio from "socket.io";
import {io} from "../Config/SocketIO";

export function onMessage(socket: socketio.Socket, data: Message): void {
    // FIXME: Implement
    console.log("onMessage", data);
}

