import {
    CreateRoomResponse,
    JoinRoomResponse,
    NewRoom,
    QueryRoomsResponse,
    UpdateRoom
} from "Interface/Lobby";
import {Param} from "Poker/Defaults";

import {connect} from "../SocketIO";
import {NewRoomParamsForm} from "../UI/Lobby/NewRoomParamsForm";
import {RoomsTable} from "../UI/Lobby/RoomsTable";

interface LobbyWindow extends Window {
    main: (params: Param[]) => void;
}

declare var window: LobbyWindow;

window.main = (params: Param[]) => {
    const socket = connect();

    const newRoomParamsForm = new NewRoomParamsForm(params, requestedParams => {
        socket.emit("create-room", {params: requestedParams});
    });

    const roomsTable =
        new RoomsTable(roomId => { socket.emit("join-room", {roomId}); });

    // socket.on("message", onMessage);
    // socket.on("log-in", onLogIn);
    // socket.on("log-out", onLogOut);
    // socket.on("new-user", onNewUser);
    // socket.on("delete-room", onDeleteRoom);

    socket.on("new-room", (data: NewRoom) => {
        console.log("onNewRoom", data);
        roomsTable.update([data]);
    });
    socket.on("update-room", (data: UpdateRoom) => {
        console.log("onUpdateRoom", data);
        roomsTable.update([data]);
    });
    socket.on("join-room", (data: JoinRoomResponse) => {
        console.log("onJoin", data);
        if (data.error) {
            alert(data.error);
            return;
        }
        window.location.href = "/room.do";
    });
    socket.on("create-room", (data: CreateRoomResponse) => {
        console.log("onCreateRoom", data);
        if (data.error) {
            alert(data.error);
            return;
        }
        window.location.href = "/room.do";
    });
    socket.on("query-rooms", (data: QueryRoomsResponse) => {
        console.log("onQueryRooms", data);
        roomsTable.update(data.rooms);
    });

    // get the data for the rooms table
    socket.emit("query-rooms");

    window.addEventListener("beforeunload", console.log);
}
