"use strict";
exports.__esModule = true;
var App_1 = require("./App");
var SocketIO_1 = require("./Config/SocketIO");
var PORT = process.env.PORT;
exports.server = App_1.app.listen(PORT, function () { console.log("Listening at http://localhost:" + PORT); });
SocketIO_1.configureSocketIO(exports.server);
//# sourceMappingURL=main.js.map