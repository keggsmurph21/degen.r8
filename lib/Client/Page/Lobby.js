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
var Defaults_1 = require("Poker/Defaults");
var Chat_1 = require("../Model/Chat");
var Lobby_1 = require("../Model/Lobby");
var SocketIO_1 = require("../SocketIO");
var NewRoomParam = (function () {
    function NewRoomParam(name, param) {
        this.name = name;
        this.param = param;
        this.span = document.createElement("span");
        this.label = document.createElement("label");
        this.label.setAttribute("for", name);
        this.label.innerText = name.replace(/_/g, " ").toLowerCase();
        this.span.appendChild(this.label);
        this.input = document.createElement("input");
        this.input.setAttribute("id", name);
        switch (param.type) {
            case Defaults_1.ParamType.Bool:
                this.input.setAttribute("type", "checkbox");
                if (param.DEFAULT)
                    this.input.setAttribute("checked", "");
                break;
            case Defaults_1.ParamType.Int:
                this.input.setAttribute("type", "range");
                this.input.setAttribute("min", param.MIN.toString());
                this.input.setAttribute("max", param.MAX.toString());
                this.input.setAttribute("step", "1");
                this.input.setAttribute("value", param.DEFAULT.toString());
                break;
            case Defaults_1.ParamType.Float:
                this.input.setAttribute("type", "range");
                this.input.setAttribute("min", param.MIN.toString());
                this.input.setAttribute("max", param.MAX.toString());
                this.input.setAttribute("step", "0.01");
                this.input.setAttribute("value", param.DEFAULT.toString());
                break;
            case Defaults_1.ParamType.Str:
                this.input.setAttribute("type", "text");
                var pattern = param.PATTERN.toString();
                this.input.setAttribute("pattern", pattern.slice(1, pattern.length - 1));
                if (param.DEFAULT !== null)
                    this.input.setAttribute("value", param.DEFAULT);
                break;
        }
        this.span.appendChild(this.input);
    }
    NewRoomParam.prototype.getValue = function () {
        switch (this.param.type) {
            case Defaults_1.ParamType.Bool:
                return this.input.checked;
            case Defaults_1.ParamType.Int:
                return parseInt(this.input.getAttribute("value"));
            case Defaults_1.ParamType.Float:
                return parseFloat(this.input.getAttribute("value"));
            case Defaults_1.ParamType.Str:
                return this.input.value;
        }
    };
    return NewRoomParam;
}());
var NewRoomParams = (function () {
    function NewRoomParams(params, onSubmit) {
        var _this = this;
        this.onSubmit = onSubmit;
        this.params = [];
        this.container = document.getElementById("new-room-params-container");
        Object.entries(params).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            var param = new NewRoomParam(key, value);
            _this.params.push(param);
            _this.container.appendChild(param.span);
        });
        var secretParam = new NewRoomParam("secret", new Defaults_1.StrParam(/^[a-zA-Z0-9_.-]{0,16}$/, null));
        this.params.push(secretParam);
        this.container.appendChild(secretParam.span);
        this.submitButton = document.createElement("button");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.innerText = "create";
        this.submitButton.addEventListener("click", function (_) { return _this.onSubmit(_this.entries()); });
        this.container.appendChild(this.submitButton);
    }
    NewRoomParams.prototype.entries = function () {
        var entries = [];
        this.params.forEach(function (param) { entries[param.name] = param.getValue(); });
        return entries;
    };
    return NewRoomParams;
}());
window.main = function (params) {
    var socket = SocketIO_1.connect();
    console.log(params);
    var newRoomParams = new NewRoomParams(params, function (entries) { console.log(entries); });
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