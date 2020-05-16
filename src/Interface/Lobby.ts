import {RoomSummary} from "Poker/Room";

export interface DeleteRoom {
    roomId: number;
}

export interface NewRoom {
    roomId: number;
}

export interface UpdateRoom {
    roomId: number;
}

export interface JoinRoomRequest {
    roomId: number;
}

export interface JoinRoomResponse {
    roomId: number;
}

export interface CreateRoomRequest {
    roomId: number;
}

export interface CreateRoomResponse {
    roomId: number;
}

export interface QueryRoomsRequest {}

export interface QueryRoomsResponse {
    rooms: RoomSummary[];
}
