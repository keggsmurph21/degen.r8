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
    function NewRoomParam(param) {
        this.param = param;
        this.div = document.createElement("div");
        this.label = document.createElement("label");
        this.label.setAttribute("for", param.name);
        this.label.innerText = param.displayName;
        this.div.appendChild(this.label);
        this.input = document.createElement("input");
        this.input.setAttribute("id", param.name);
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
        this.div.appendChild(this.input);
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
    NewRoomParam.prototype.setControllingParam = function (controller) {
        var _this = this;
        var toggleDisabled = function () {
            if (controller.getValue()) {
                _this.input.removeAttribute("disabled");
            }
            else {
                _this.input.setAttribute("disabled", "");
            }
        };
        controller.input.addEventListener("change", function (_) { return toggleDisabled(); });
        toggleDisabled();
    };
    return NewRoomParam;
}());
var NewRoomParamsForm = (function () {
    function NewRoomParamsForm(params, onSubmit) {
        var _this = this;
        this.onSubmit = onSubmit;
        this.newRoomParams = {};
        this.container = document.getElementById("new-room-params-container");
        params.forEach(function (param) {
            var newRoomParam = new NewRoomParam(param);
            _this.newRoomParams[param.name] = newRoomParam;
            _this.container.appendChild(newRoomParam.div);
        });
        this.newRoomParams["bigBlindBet"].setControllingParam(this.newRoomParams["useBlinds"]);
        this.newRoomParams["smallBlindBet"].setControllingParam(this.newRoomParams["useBlinds"]);
        this.newRoomParams["anteBet"].setControllingParam(this.newRoomParams["useAntes"]);
        var secretParam = new NewRoomParam(new Defaults_1.StrParam("secret", "secret", /^[a-zA-Z0-9_.-]{0,16}$/, null));
        this.newRoomParams[secretParam.param.name] = secretParam;
        this.container.appendChild(secretParam.div);
        this.submitButton = document.createElement("button");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.innerText = "create";
        this.submitButton.addEventListener("click", function (_) { return _this.onSubmit(_this.entries()); });
        this.container.appendChild(this.submitButton);
    }
    NewRoomParamsForm.prototype.entries = function () {
        var entries = {};
        Object.entries(this.newRoomParams).forEach(function (_a) {
            var _b = __read(_a, 2), name = _b[0], newRoomParam = _b[1];
            entries[newRoomParam.param.name] = newRoomParam.getValue();
        });
        return entries;
    };
    return NewRoomParamsForm;
}());
var RoomRow = (function () {
    function RoomRow(room) {
        var _this = this;
        this.room = room;
        this.cells = {};
        this.dataColumnNames = [
            "id",
            "numSitting",
            "capacity",
            "numStanding",
            "minimumBet",
        ];
        this.tr = document.createElement("tr");
        this.dataColumnNames.forEach(function (name) {
            _this.cells[name] =
                document.createElement("td");
            _this.cells[name].innerText = room[name].toString();
            _this.tr.appendChild(_this.cells[name]);
        });
        var joinCell = document.createElement("td");
        var joinButton = document.createElement("button");
        joinButton.setAttribute("type", "button");
        joinButton.innerText = "join";
        joinButton.addEventListener("click", console.log);
        joinCell.appendChild(joinButton);
        this.tr.appendChild(joinCell);
    }
    RoomRow.prototype.update = function (room) {
        var _this = this;
        this.dataColumnNames.forEach(function (name) {
            if (room[name] === _this.room[name])
                return;
            _this.cells[name].innerText = room[name].toString();
        });
        this.room = room;
    };
    return RoomRow;
}());
var RoomsTable = (function () {
    function RoomsTable() {
        this.headerNames = [
            "id",
            "sitting",
            "capacity",
            "standing",
            "minimum bet",
            "join",
        ];
        this.rows = {};
        this.container = document.getElementById("rooms-container");
        this.table = document.createElement("table");
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        this.headerNames.forEach(function (name) {
            var th = document.createElement("th");
            th.innerText = name;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        this.table.appendChild(thead);
        this.container.appendChild(this.table);
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.tbody);
    }
    RoomsTable.prototype.update = function (rooms) {
        var _this = this;
        rooms.forEach(function (room) {
            if (_this.rows[room.id] !== undefined) {
                _this.rows[room.id].update(room);
            }
            else {
                var roomRow = new RoomRow(room);
                _this.rows[roomRow.room.id] = roomRow;
                _this.tbody.appendChild(roomRow.tr);
            }
        });
    };
    return RoomsTable;
}());
window.main = function (params) {
    var socket = SocketIO_1.connect();
    var newRoomParamsForm = new NewRoomParamsForm(params, function (requestedParams) {
        socket.emit("create-room", { params: requestedParams });
    });
    var roomsTable = new RoomsTable();
    socket.on("message", Chat_1.onMessage);
    socket.on("delete-room", Lobby_1.onDeleteRoom);
    socket.on("new-room", Lobby_1.onNewRoom);
    socket.on("update-room", Lobby_1.onUpdateRoom);
    socket.on("join-room", Lobby_1.onJoinRoom);
    socket.on("create-room", Lobby_1.onCreateRoom);
    socket.on("query-rooms", function (data) { roomsTable.update(data.rooms); });
    socket.emit("query-rooms");
};
//# sourceMappingURL=Lobby.js.map