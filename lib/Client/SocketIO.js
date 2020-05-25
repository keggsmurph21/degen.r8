"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var socket_io_client_1 = __importDefault(require("socket.io-client"));
function connect() {
    var socket = socket_io_client_1["default"]();
    return socket;
}
exports.connect = connect;
//# sourceMappingURL=SocketIO.js.map