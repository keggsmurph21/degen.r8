"use strict";
exports.__esModule = true;
var Utils_1 = require("Utils");
var SocketIO_1 = require("../SocketIO");
var Constants_1 = require("../UI/Room/Constants");
var Table_1 = require("../UI/Room/Table");
var SVG_1 = require("../UI/SVG");
function getRandomUsername(_) {
    var username = "";
    var len = Utils_1.randomInRange(6, 25);
    for (var i = 0; i < len; ++i) {
        var ch = String.fromCharCode(Utils_1.randomInRange(98, 123));
        username += ch;
    }
    return username;
}
window.main = function (view) {
    var socket = SocketIO_1.connect(null);
    var container = document.getElementById("table-container");
    var svg = SVG_1.createSVGElement("svg", {
        attrs: {
            xmlns: SVG_1.SVG_NS,
            viewBox: Constants_1.viewBox,
            height: "100%",
            width: "100%"
        }
    });
    container.appendChild(svg);
    var table = new Table_1.TableWidget(view, getRandomUsername, function (name, argument) {
        console.log(name, argument);
        switch (name) {
            case "sit":
                socket.emit("sit", { seatIndex: argument });
                break;
            case "stand":
                socket.emit("stand", {});
                break;
            case "leave":
                socket.emit("leave", {});
                break;
            case "start":
                socket.emit("start", {});
                break;
            case "fold":
                socket.emit("fold", {});
                break;
            case "call":
                socket.emit("call", {});
                break;
            case "raise":
                socket.emit("raise", { raiseBy: argument });
                break;
            default:
                alert("not implemented: " + name);
        }
    });
    table.transform({ translate: { y: -Constants_1.tableRadius * 0.2 } });
    svg.appendChild(table.container);
    socket.on("room-changed", function (data) {
        console.log("room-changed", data);
        if (data.error) {
            alert(data.error);
            return;
        }
        table.update(data.view);
    });
};
//# sourceMappingURL=Room.js.map