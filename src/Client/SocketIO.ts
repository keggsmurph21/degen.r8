import io from "socket.io-client";
import {User} from "./Model/User";

export function connect(user: User, roomId: number): io.Socket {
    // const socket = io("", {query: `userId=${user.id}&roomId=${roomId}`});
    const socket = io("", {query: `userId=&roomId=`});
    return socket;
}
