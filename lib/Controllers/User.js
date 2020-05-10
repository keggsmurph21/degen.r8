"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var passport_1 = __importDefault(require("passport"));
var User_1 = require("../Models/User");
function validateFloat(parameterName, rawValue, minValue, maxValue, decimalPrecision) {
    if (decimalPrecision === void 0) { decimalPrecision = 2; }
    var offset = Math.pow(10, decimalPrecision);
    var value = Math.round((parseFloat(rawValue) + Number.EPSILON) * offset) / offset;
    if (isNaN(value))
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is not a number");
    if (value < minValue || maxValue < value)
        throw new Error("invalid " + parameterName + ": value '" + rawValue + "' is outside range " + minValue + " to " + maxValue);
    return value;
}
var userController;
(function (userController) {
    var _this = this;
    userController.getLogin = function (req, res) { res.render("login"); };
    userController.postLogin = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var authenticate;
        return __generator(this, function (_a) {
            try {
                authenticate = passport_1["default"].authenticate("local", function (err, user, info) {
                    if (err)
                        return next(err);
                    if (!user) {
                        console.log(info);
                        return res.redirect("/login");
                    }
                    req.logIn(user, function (err) {
                        if (err)
                            return next(err);
                        return res.redirect("/");
                    });
                });
                authenticate(req, res);
            }
            catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
            return [2];
        });
    }); };
    userController.postLogout = function (req, res) {
        req.logout();
        res.redirect("/");
    };
    userController.getRegister = function (req, res) { res.render("register"); };
    userController.postRegister = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var PASSWORD_REGEX, USERNAME_REGEX, name, existingUser, password, newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    PASSWORD_REGEX = /.{6,32}/;
                    USERNAME_REGEX = /[a-zA-Z][a-zA-Z0-9_.-]{4,32}/;
                    name = req.body.name;
                    if (!name) {
                        req.flash("errors", "missing required field: username");
                        return [2, res.redirect("/register.do")];
                    }
                    if (!name.match(USERNAME_REGEX)) {
                        req.flash("errors", "invalid username");
                        return [2, res.redirect("/register.do")];
                    }
                    return [4, User_1.User.byName(name)];
                case 1:
                    existingUser = _a.sent();
                    if (existingUser !== null) {
                        req.flash("errors", "a user with this name already exists!");
                        return [2, res.redirect("/register.do")];
                    }
                    password = req.body.password;
                    if (!password) {
                        req.flash("errors", "missing required field: password");
                        return [2, res.redirect("/register.do")];
                    }
                    if (!password.match(PASSWORD_REGEX)) {
                        req.flash("errors", "invalid password");
                        return [2, res.redirect("/register.do")];
                    }
                    return [4, User_1.User.create(name, password)];
                case 2:
                    newUser = _a.sent();
                    req.flash("info", "success!");
                    res.redirect("/login.do");
                    return [2];
            }
        });
    }); };
    userController.postAddBalance = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var credit, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        credit =
                            validateFloat("credit", req.body.credit, 0.01, 100.00);
                    }
                    catch (e) {
                        req.flash("errors", e.message);
                        res.sendStatus(501);
                    }
                    user = req.user;
                    user.balance += credit;
                    return [4, User_1.User.save(user)];
                case 1:
                    _a.sent();
                    console.log("MAKE THIS VIA AJAX");
                    res.sendStatus(501);
                    return [2];
            }
        });
    }); };
})(userController = exports.userController || (exports.userController = {}));
//# sourceMappingURL=User.js.map