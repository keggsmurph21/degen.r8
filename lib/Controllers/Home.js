"use strict";
exports.__esModule = true;
var homeController;
(function (homeController) {
    homeController.getHome = function (req, res) { res.render("index", { isLoggedIn: !!req.user }); };
})(homeController = exports.homeController || (exports.homeController = {}));
//# sourceMappingURL=Home.js.map