import {RoomSummary} from "Poker/Room";

export interface Form {
    [key: string]: any;
}

export interface DeleteRoom {
    roomId: number;
}

export interface NewRoom {
    id: number;
    capacity: number;
    numSitting: number;
    numStanding: number;
    minimumBet: number;
}

export interface UpdateRoom {
    id: number;
    capacity: number;
    numSitting: number;
    numStanding: number;
    minimumBet: number;
}

export interface JoinRoomRequest {
    roomId: number;
}

export interface JoinRoomResponse {
    roomId: number;
}

export interface CreateRoomRequest {
    params: Form;
}

export interface CreateRoomResponse {
    error: string|null;
    roomId: number|null;
}

export interface QueryRoomsRequest {}

export interface QueryRoomsResponse {
    rooms: RoomSummary[];
}
