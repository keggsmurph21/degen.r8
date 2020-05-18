"use strict";
exports.__esModule = true;
var RoomRow = (function () {
    function RoomRow(room, onJoin) {
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
        joinButton.addEventListener("click", function (_) { return onJoin(_this.room.id); });
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
    function RoomsTable(onJoin) {
        this.onJoin = onJoin;
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
                var roomRow = new RoomRow(room, _this.onJoin);
                _this.rows[roomRow.room.id] = roomRow;
                _this.tbody.appendChild(roomRow.tr);
            }
        });
    };
    return RoomsTable;
}());
exports.RoomsTable = RoomsTable;
//# sourceMappingURL=RoomsTable.js.map