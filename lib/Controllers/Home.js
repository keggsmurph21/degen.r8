"use strict";
exports.__esModule = true;
var homeController;
(function (homeController) {
    homeController.getHome = function (req, res) {
        var user = req.user;
        res.render("index", {
            user: user ? { id: user.id, name: user.name } : null
        });
    };
})(homeController = exports.homeController || (exports.homeController = {}));
//# sourceMappingURL=Home.js.map