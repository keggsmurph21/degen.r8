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
    public newRoomParams: {[name: string]: InputWidget} = {};
    constructor(params: Param[],
                public readonly onSubmit: (entries: Form) => void) {
        this.container = document.getElementById("new-room-params-container");

        const titleContainer = document.createElement("div") as HTMLDivElement;
        titleContainer.classList.add("title-container");
        this.container.appendChild(titleContainer);

        const title = document.createElement("h3") as HTMLHeadingElement;
        title.innerText = "create new room";
        titleContainer.appendChild(title);

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
                    step: 1,
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

        const submitContainer = document.createElement("div") as HTMLDivElement;
        submitContainer.classList.add("submit-container");
        this.container.appendChild(submitContainer);

        const submitButton =
            document.createElement("button") as HTMLButtonElement;
        submitButton.setAttribute("type", "button");
        submitButton.innerText = "create";
        submitButton.addEventListener("click",
                                      _ => this.onSubmit(this.entries()));
        submitContainer.appendChild(submitButton);
    }
    public entries(): Form {
        let entries: Form = {};
        Object.entries(this.newRoomParams).forEach(([name, newRoomParam]) => {
            entries[name] = newRoomParam.value();
        });
        console.log(entries);
        return entries;
    }
}
