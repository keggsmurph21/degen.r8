import {Form} from "Interface/Lobby";
import {Param, Params, ParamType, StrParam} from "Poker/Defaults";

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

declare global {
    interface Window {
        main: (params: Param[]) => void;
    }
}

class NewRoomParam {
    public div: HTMLDivElement;
    public label: HTMLLabelElement;
    public input: HTMLInputElement;
    constructor(public readonly param: Param) {
        this.div = document.createElement("div");

        this.label = document.createElement("label");
        this.label.setAttribute("for", param.name);
        this.label.innerText = param.displayName;
        this.div.appendChild(this.label);

        this.input = document.createElement("input");
        this.input.setAttribute("id", param.name);
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
        this.div.appendChild(this.input);
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
    public setControllingParam(controller: NewRoomParam): void {
        const toggleDisabled = () => {
            if (controller.getValue()) {
                this.input.removeAttribute("disabled");
            } else {
                this.input.setAttribute("disabled", "");
            }
        };
        controller.input.addEventListener("change", _ => toggleDisabled());
        toggleDisabled();
    }
}

class NewRoomParams {
    public readonly container: HTMLDivElement;
    public readonly submitButton: HTMLButtonElement;
    public newRoomParams: {[name: string]: NewRoomParam} = {};
    constructor(params: Param[],
                public readonly onSubmit: (entries: Form) => void) {
        this.container = document.getElementById("new-room-params-container") as
                         HTMLDivElement;
        params.forEach(param => {
            const newRoomParam = new NewRoomParam(param);
            this.newRoomParams[param.name] = newRoomParam;
            this.container.appendChild(newRoomParam.div);
        });

        this.newRoomParams["bigBlindBet"].setControllingParam(
            this.newRoomParams["useBlinds"]);
        this.newRoomParams["smallBlindBet"].setControllingParam(
            this.newRoomParams["useBlinds"]);
        this.newRoomParams["anteBet"].setControllingParam(
            this.newRoomParams["useAntes"]);

        // FIXME: This StrParam should also exist on the server!
        const secretParam = new NewRoomParam(
            new StrParam("secret", "secret", /^[a-zA-Z0-9_.-]{0,16}$/, null));
        this.newRoomParams[secretParam.param.name] = secretParam;
        this.container.appendChild(secretParam.div);

        this.submitButton = document.createElement("button");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.innerText = "create";
        this.submitButton.addEventListener("click",
                                           _ => this.onSubmit(this.entries()));
        this.container.appendChild(this.submitButton);
    }
    public entries(): Form {
        let entries = {};
        Object.entries(this.newRoomParams).forEach(([name, newRoomParam]) => {
            entries[newRoomParam.param.name] = newRoomParam.getValue();
        });
        return entries;
    }
}

window.main = (params: Param[]) => {
    const socket = connect();

    const newRoomParams = new NewRoomParams(params, requestedParams => {
        socket.emit("create-room", {params: requestedParams});
    });

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
