"use strict";
exports.__esModule = true;
var app_1 = require("./app");
var PORT = process.env.PORT;
exports.server = app_1.app.listen(PORT, function () { console.log("Listening at http://localhost:" + PORT); });
//# sourceMappingURL=server.js.map