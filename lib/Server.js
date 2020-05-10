"use strict";
exports.__esModule = true;
var App_1 = require("./App");
var PORT = process.env.PORT;
exports.server = App_1.app.listen(PORT, function () { console.log("Listening at http://localhost:" + PORT); });
//# sourceMappingURL=Server.js.map