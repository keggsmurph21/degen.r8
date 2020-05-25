"use strict";
exports.__esModule = true;
var SocketIO_1 = require("../SocketIO");
var NewRoomParamsForm_1 = require("../UI/Lobby/NewRoomParamsForm");
var RoomsTable_1 = require("../UI/Lobby/RoomsTable");
window.main = function (params) {
    var socket = SocketIO_1.connect();
    var newRoomParamsForm = new NewRoomParamsForm_1.NewRoomParamsForm(params, function (requestedParams) {
        socket.emit("create-room", { params: requestedParams });
    });
    var roomsTable = new RoomsTable_1.RoomsTable(function (roomId) { socket.emit("join-room", { roomId: roomId }); });
    socket.on("new-room", function (data) {
        console.log("onNewRoom", data);
        roomsTable.update([data]);
    });
    socket.on("update-room", function (data) {
        console.log("onUpdateRoom", data);
        roomsTable.update([data]);
    });
    socket.on("join-room", function (data) {
        console.log("onJoin", data);
        if (data.error) {
            alert(data.error);
            return;
        }
        window.location.href = "/room.do";
    });
    socket.on("create-room", function (data) {
        console.log("onCreateRoom", data);
        if (data.error) {
            alert(data.error);
            return;
        }
        window.location.href = "/room.do";
    });
    socket.on("query-rooms", function (data) {
        console.log("onQueryRooms", data);
        roomsTable.update(data.rooms);
    });
    socket.emit("query-rooms");
    window.addEventListener("beforeunload", console.log);
};
//# sourceMappingURL=Lobby.js.map