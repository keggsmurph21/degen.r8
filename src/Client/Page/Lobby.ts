import {Param, ParamType, StrParam} from "Poker/Defaults";

import {onMessage} from "../Model/Chat";
import {
    onCreateRoom,
    onDeleteRoom,
    onJoinRoom,
    onNewRoom,
    onQueryRooms,
    onUpdateRoom
} from "../Model/Lobby";
import {User} from "../Model/User";
import {connect} from "../SocketIO";

interface ParamMap {
    [name: string]: Param
}

declare global {
    interface Window {
        main: (params: ParamMap) => void;
    }
}

class NewRoomParam {
    public span: HTMLSpanElement;
    public label: HTMLLabelElement;
    public input: HTMLInputElement;
    constructor(public readonly name: string, public readonly param: Param) {
        this.span = document.createElement("span");

        this.label = document.createElement("label");
        this.label.setAttribute("for", name);
        this.label.innerText = name.replace(/_/g, " ").toLowerCase();
        this.span.appendChild(this.label);

        this.input = document.createElement("input");
        this.input.setAttribute("id", name);
        switch (param.type) {
        case ParamType.Bool:
            this.input.setAttribute("type", "checkbox");
            if (param.DEFAULT)
                this.input.setAttribute("checked", "");
            break;
        case ParamType.Int:
            this.input.setAttribute("type", "range");
            this.input.setAttribute("min", param.MIN.toString());
            this.input.setAttribute("max", param.MAX.toString());
            this.input.setAttribute("step", "1");
            this.input.setAttribute("value", param.DEFAULT.toString());
            break;
        case ParamType.Float:
            this.input.setAttribute("type", "range");
            this.input.setAttribute("min", param.MIN.toString());
            this.input.setAttribute("max", param.MAX.toString());
            this.input.setAttribute("step", "0.01");
            this.input.setAttribute("value", param.DEFAULT.toString());
            break;
        case ParamType.Str:
            this.input.setAttribute("type", "text");
            // "pattern" attr shouldn't have enclosing /slashes/
            const pattern = param.PATTERN.toString();
            this.input.setAttribute("pattern",
                                    pattern.slice(1, pattern.length - 1));
            if (param.DEFAULT !== null)
                this.input.setAttribute("value", param.DEFAULT);
            break;
        }
        this.span.appendChild(this.input);
    }
    public getValue(): boolean|number|string {
        switch (this.param.type) {
        case ParamType.Bool:
            return this.input.checked;
        case ParamType.Int:
            return parseInt(this.input.getAttribute("value"));
        case ParamType.Float:
            return parseFloat(this.input.getAttribute("value"));
        case ParamType.Str:
            return this.input.value;
        }
    }
}

interface FormEntries {
    [name: string]: any;
}

class NewRoomParams {
    public readonly container: HTMLDivElement;
    public readonly submitButton: HTMLButtonElement;
    public params: NewRoomParam[] = [];
    constructor(params: ParamMap,
                public readonly onSubmit: (entries: FormEntries) => void) {
        this.container = document.getElementById("new-room-params-container") as
                         HTMLDivElement;

        Object.entries(params).forEach(([key, value]) => {
            const param = new NewRoomParam(key, value);
            this.params.push(param);
            this.container.appendChild(param.span);
        });

        const secretParam = new NewRoomParam(
            "secret", new StrParam(/^[a-zA-Z0-9_.-]{0,16}$/, null));
        this.params.push(secretParam);
        this.container.appendChild(secretParam.span);

        this.submitButton = document.createElement("button");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.innerText = "create";
        this.submitButton.addEventListener("click",
                                           _ => this.onSubmit(this.entries()));
        this.container.appendChild(this.submitButton);
    }
    public entries(): FormEntries {
        let entries = [];
        this.params.forEach(
            param => { entries[param.name] = param.getValue(); });
        return entries;
    }
}

window.main = (params: ParamMap) => {
    // const createButton = document.getElementById("create-button");

    const socket = connect();
    console.log(params);

    const newRoomParams =
        new NewRoomParams(params, entries => { console.log(entries); });

    socket.on("message", onMessage);

    // socket.on("log-in", onLogIn);
    // socket.on("log-out", onLogOut);
    // socket.on("new-user", onNewUser);

    socket.on("delete-room", onDeleteRoom);
    socket.on("new-room", onNewRoom);
    socket.on("update-room", onUpdateRoom);
    socket.on("query-rooms", onQueryRooms);
    socket.on("join-room", onJoinRoom);
    socket.on("create-room", onCreateRoom);

    socket.emit("query-rooms");
}
