import io from "socket.io-client";
import {User} from "./Model/User";

export function connect(): io.Socket {
    // const socket = io("", {query: `userId=${user.id}&roomId=${roomId}`});
    const socket = io();
    return socket;
}
