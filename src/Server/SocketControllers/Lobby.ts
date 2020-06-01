import {
    CreateRoomRequest,
    CreateRoomResponse,
    JoinRoomRequest,
    JoinRoomResponse,
    NewRoom,
    QueryRoomsRequest,
    UpdateRoom,
} from "Interface/Lobby";
import socketio from "socket.io";

import {channelNameFor} from "../Config/SocketIO";
import {io} from "../Config/SocketIO";
import {
    create,
    enter,
    summarize,
    validateRoomParameters
} from "../Services/RoomService";

export async function onQueryRooms(socket: socketio.Socket,
                                   data: QueryRoomsRequest): Promise<void> {
    const rooms = await summarize();
    socket.emit("query-rooms", {rooms});
}

export async function onJoinRoom(socket: socketio.Socket,
                                 data: JoinRoomRequest): Promise<void> {
    console.log("onJoin", data);
    let res: JoinRoomResponse;
    try {
        const userId = socket.request.session.passport.user;
        const roomId = data.roomId;
        const secret = data.secret;
        const room = await enter(userId, roomId, secret);
        socket.request.session.roomId = roomId;
        socket.request.session.secret = secret;
        socket.request.session.save();
        if (!secret) {
            const updateRoomData: UpdateRoom = {
                id: roomId,
                capacity: room.params.capacity,
                numSitting: room.sitting.filter(p => p !== null).length,
                numStanding: room.standing.filter(p => p !== null).length,
                minimumBet: room.params.minimumBet,
            };
            socket.to(channelNameFor(null)).emit("update-room", updateRoomData);
        }
        res = {error: null, roomId};
    } catch (e) {
        res = {error: e.message, roomId: null};
    }
    socket.emit("join-room", res);
}

export async function onCreateRoom(socket: socketio.Socket,
                                   data: CreateRoomRequest): Promise<void> {
    let res: CreateRoomResponse;
    try {
        const params = validateRoomParameters(data.params);
        const userId = socket.request.session.passport.user;
        const secret = data.params.secret;
        const [roomId, room] = await create(userId, secret, params);
        socket.request.session.roomId = roomId;
        socket.request.session.secret = secret;
        socket.request.session.save();
        if (!secret) {
            const newRoomData: NewRoom = {
                id: roomId,
                capacity: room.params.capacity,
                numSitting: room.sitting.filter(p => p !== null).length,
                numStanding: room.standing.filter(p => p !== null).length,
                minimumBet: room.params.minimumBet,
            };
            socket.to(channelNameFor(null)).emit("new-room", newRoomData);
        }
        res = {error: null, roomId};
    } catch (e) {
        res = {error: e.message, roomId: null};
    }
    socket.emit("create-room", res);
}

