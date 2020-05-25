import {RoomResponse} from "Interface/Room";
import {RoomView} from "Poker/Room";
import {randomInRange} from "Utils";

import {connect} from "../SocketIO";
import {tableRadius, viewBox} from "../UI/Room/Constants";
import {TableData, TableWidget} from "../UI/Room/Table";
import {createSVGElement, removeChildren, SVG_NS} from "../UI/SVG";

interface RoomWindow extends Window {
    main: (view: RoomView) => void;
}

declare var window: RoomWindow;

function getRandomUsername(_: any) {
    let username = "";
    const len = randomInRange(6, 25);
    for (let i = 0; i < len; ++i) {
        const ch = String.fromCharCode(randomInRange(98, 123));
        username += ch;
    }
    return username;
}

window.main = (view: RoomView) => {
    const socket = connect(null);

    const container = document.getElementById("table-container");
    const svg = createSVGElement("svg", {
        attrs: {
            xmlns: SVG_NS,
            viewBox,
            height: "100%",
            width: "100%",
        }
    });
    container.appendChild(svg);

    const table = new TableWidget(
        view, getRandomUsername, (name: string, argument?: number): void => {
            console.log(name, argument);
            switch (name) {
            case "sit":
                socket.emit("sit", {seatIndex: argument});
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
                socket.emit("raise", {raiseBy: argument});
                break;
            default:
                alert("not implemented: " + name);
            }
        });
    // FIXME: Only transform if we have a betting interface
    table.transform({translate: {y: -tableRadius * 0.2}});
    svg.appendChild(table.container);

    // socket.on("message", onMessage);
    // socket.on("new-user", onNewUser);

    socket.on("room-changed", (data: RoomResponse) => {
        console.log("room-changed", data);
        if (data.error) {
            alert(data.error);
            return;
        }
        table.update(data.view);
    });
};
