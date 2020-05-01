"use strict";
exports.__esModule = true;
var Player_1 = require("./Poker/Player");
var Table_1 = require("./Poker/Table");
var t = new Table_1.Table(4, "testing");
t.addPlayer(new Player_1.Player(), 2);
try {
    t.addPlayer(new Player_1.Player(), 6);
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=main.js.map