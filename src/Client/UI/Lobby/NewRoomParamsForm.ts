import {Form} from "Interface/Lobby";
import {IParam, Param, ParamType, StrParam} from "Poker/Defaults";

import {
    BoolInputWidget,
    FloatInputWidget,
    InputWidget,
    IntInputWidget,
    StrInputWidget
} from "../Input";

export class NewRoomParamsForm {
    public readonly container: HTMLElement;
    public readonly submitButton: HTMLButtonElement;
    public newRoomParams: {[name: string]: InputWidget} = {};
    constructor(params: Param[],
                public readonly onSubmit: (entries: Form) => void) {
        this.container = document.getElementById("new-room-params-container");
        params.forEach(param => {
            let newRoomParam: InputWidget;
            console.log(`Getting widget for type "${param.type}"`, param);
            switch (param.type) {
            case "bool":
                newRoomParam = new BoolInputWidget({
                    id: param.name,
                    labelText: param.displayName,
                    default: param.DEFAULT,
                });
                break;
            case "int":
                newRoomParam = new IntInputWidget({
                    id: param.name,
                    labelText: param.displayName,
                    default: param.DEFAULT,
                    min: param.MIN,
                    max: param.MAX,
                });
                break;
            case "float":
                newRoomParam = new FloatInputWidget({
                    id: param.name,
                    labelText: param.displayName,
                    default: param.DEFAULT,
                    min: param.MIN,
                    max: param.MAX,
                    step: 0.01,
                });
                break;
            case "str":
                newRoomParam = new StrInputWidget({
                    id: param.name,
                    labelText: param.displayName,
                    default: param.DEFAULT,
                    pattern: param.PATTERN,
                });
                break;
            }
            this.newRoomParams[param.name] = newRoomParam;
            this.container.appendChild(newRoomParam.container);
        });

        this.newRoomParams["bigBlindBet"].setController(
            this.newRoomParams["useBlinds"]);
        this.newRoomParams["smallBlindBet"].setController(
            this.newRoomParams["useBlinds"]);
        this.newRoomParams["anteBet"].setController(
            this.newRoomParams["useAntes"]);

        // FIXME: This StrParam should also exist on the server!
        const secretParam = new StrInputWidget({
            id: "secret",
            labelText: "secret",
            default: null,
            pattern: /^[a-zA-Z0-9_.-]{0,16}$/,
        });
        this.newRoomParams["secret"] = secretParam;
        this.container.appendChild(secretParam.container);

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
            entries[name] = newRoomParam.value();
        });
        console.log(entries);
        return entries;
    }
}

