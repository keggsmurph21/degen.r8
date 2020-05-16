"use strict";
exports.__esModule = true;
var Chat_1 = require("../Model/Chat");
var Lobby_1 = require("../Model/Lobby");
var SocketIO_1 = require("../SocketIO");
window.main = function (user, roomId) {
    var createButton = document.getElementById("create-button");
    console.log(createButton);
    var socket = SocketIO_1.connect(user, roomId);
    socket.on("message", Chat_1.onMessage);
    socket.on("delete-room", Lobby_1.onDeleteRoom);
    socket.on("new-room", Lobby_1.onNewRoom);
    socket.on("update-room", Lobby_1.onUpdateRoom);
    socket.on("query-rooms", Lobby_1.onQueryRooms);
    socket.on("join-room", Lobby_1.onJoinRoom);
    socket.on("create-room", Lobby_1.onCreateRoom);
    socket.emit("query-rooms");
};
//# sourceMappingURL=Lobby.js.map