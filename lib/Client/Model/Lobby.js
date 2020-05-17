"use strict";
exports.__esModule = true;
var Store_1 = require("./Store");
var rooms = new Store_1.Store();
function onDeleteRoom(data) {
    console.log("onDeleteRoom", data);
}
exports.onDeleteRoom = onDeleteRoom;
function onNewRoom(data) {
    console.log("onNewRoom", data);
}
exports.onNewRoom = onNewRoom;
function onUpdateRoom(data) {
    console.log("onUpdateRoom", data);
}
exports.onUpdateRoom = onUpdateRoom;
function onQueryRooms(data) {
    console.log("onQueryRooms", data);
}
exports.onQueryRooms = onQueryRooms;
function onJoinRoom(data) {
    console.log("onJoinRoom", data);
}
exports.onJoinRoom = onJoinRoom;
function onCreateRoom(data) {
    if (data.error) {
        alert(data.error);
        return;
    }
    window.location.href = "/room.do";
}
exports.onCreateRoom = onCreateRoom;
//# sourceMappingURL=Lobby.js.map