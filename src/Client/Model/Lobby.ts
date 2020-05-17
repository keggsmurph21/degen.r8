import {
    CreateRoomResponse,
    DeleteRoom,
    JoinRoomResponse,
    NewRoom,
    QueryRoomsResponse,
    UpdateRoom
} from "Interface/Lobby";
import {RoomSummary} from "Poker/Room";

import {Store} from "./Store";

const rooms = new Store<RoomSummary>();

export function onDeleteRoom(data: DeleteRoom) {
    // FIXME: Implement
    console.log("onDeleteRoom", data);
}

export function onNewRoom(data: NewRoom) {
    // FIXME: Implement
    console.log("onNewRoom", data);
}

export function onUpdateRoom(data: UpdateRoom) {
    // FIXME: Implement
    console.log("onUpdateRoom", data);
}

export function onQueryRooms(data: QueryRoomsResponse) {
    // FIXME: Implement
    console.log("onQueryRooms", data);
}

export function onJoinRoom(data: JoinRoomResponse) {
    // FIXME: Implement
    console.log("onJoinRoom", data);
}

export function onCreateRoom(data: CreateRoomResponse) {
    // FIXME: Implement
    if (data.error) {
        alert(data.error);
        return;
    }
    window.location.href = "/room.do";
}
