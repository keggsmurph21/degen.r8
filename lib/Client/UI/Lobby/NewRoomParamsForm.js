"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var Input_1 = require("../Input");
var NewRoomParamsForm = (function () {
    function NewRoomParamsForm(params, onSubmit) {
        var _this = this;
        this.onSubmit = onSubmit;
        this.newRoomParams = {};
        this.container = document.getElementById("new-room-params-container");
        var titleContainer = document.createElement("div");
        titleContainer.classList.add("title-container");
        this.container.appendChild(titleContainer);
        var title = document.createElement("h3");
        title.innerText = "create new room";
        titleContainer.appendChild(title);
        params.forEach(function (param) {
            var newRoomParam;
            console.log("Getting widget for type \"" + param.type + "\"", param);
            switch (param.type) {
                case "bool":
                    newRoomParam = new Input_1.BoolInputWidget({
                        id: param.name,
                        labelText: param.displayName,
                        "default": param.DEFAULT
                    });
                    break;
                case "int":
                    newRoomParam = new Input_1.IntInputWidget({
                        id: param.name,
                        labelText: param.displayName,
                        "default": param.DEFAULT,
                        min: param.MIN,
                        max: param.MAX,
                        step: 1
                    });
                    break;
                case "float":
                    newRoomParam = new Input_1.FloatInputWidget({
                        id: param.name,
                        labelText: param.displayName,
                        "default": param.DEFAULT,
                        min: param.MIN,
                        max: param.MAX,
                        step: 0.01
                    });
                    break;
                case "str":
                    newRoomParam = new Input_1.StrInputWidget({
                        id: param.name,
                        labelText: param.displayName,
                        "default": param.DEFAULT,
                        pattern: param.PATTERN
                    });
                    break;
            }
            _this.newRoomParams[param.name] = newRoomParam;
            _this.container.appendChild(newRoomParam.container);
        });
        this.newRoomParams["bigBlindBet"].setController(this.newRoomParams["useBlinds"]);
        this.newRoomParams["smallBlindBet"].setController(this.newRoomParams["useBlinds"]);
        this.newRoomParams["anteBet"].setController(this.newRoomParams["useAntes"]);
        var secretParam = new Input_1.StrInputWidget({
            id: "secret",
            labelText: "secret",
            "default": null,
            pattern: /^[a-zA-Z0-9_.-]{0,16}$/
        });
        this.newRoomParams["secret"] = secretParam;
        this.container.appendChild(secretParam.container);
        var submitContainer = document.createElement("div");
        submitContainer.classList.add("submit-container");
        this.container.appendChild(submitContainer);
        var submitButton = document.createElement("button");
        submitButton.setAttribute("type", "button");
        submitButton.innerText = "create";
        submitButton.addEventListener("click", function (_) { return _this.onSubmit(_this.entries()); });
        submitContainer.appendChild(submitButton);
    }
    NewRoomParamsForm.prototype.entries = function () {
        var entries = {};
        Object.entries(this.newRoomParams).forEach(function (_a) {
            var _b = __read(_a, 2), name = _b[0], newRoomParam = _b[1];
            entries[name] = newRoomParam.value();
        });
        console.log(entries);
        return entries;
    };
    return NewRoomParamsForm;
}());
exports.NewRoomParamsForm = NewRoomParamsForm;
//# sourceMappingURL=NewRoomParamsForm.js.map