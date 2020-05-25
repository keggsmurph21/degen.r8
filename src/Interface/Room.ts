import {RoomView} from "Poker/Room";

export interface SitRequest {
    seatIndex: number;
}

export interface StandRequest {}

export interface LeaveRequest {}

export interface StartRequest {}

export interface FoldRequest {}

export interface CallRequest {}

export interface RaiseRequest {
    raiseBy: number;
}

export interface RoomResponse {
    error: string|null;
    view: RoomView|null;
}
