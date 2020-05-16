import {onMessage} from "../Model/Chat";
import {
    onCreateRoom,
    onDeleteRoom,
    onJoinRoom,
    onNewRoom,
    onQueryRooms,
    onUpdateRoom
} from "../Model/Lobby";
import {User} from "../Model/User";
import {connect} from "../SocketIO";

window.main = (user: User, roomId: number) => {
    const createButton = document.getElementById("create-button");
    console.log(createButton);

    const socket = connect(user, roomId);

    socket.on("message", onMessage);

    // socket.on("log-in", onLogIn);
    // socket.on("log-out", onLogOut);
    // socket.on("new-user", onNewUser);

    socket.on("delete-room", onDeleteRoom);
    socket.on("new-room", onNewRoom);
    socket.on("update-room", onUpdateRoom);
    socket.on("query-rooms", onQueryRooms);
    socket.on("join-room", onJoinRoom);
    socket.on("create-room", onCreateRoom);

    socket.emit("query-rooms");
}
