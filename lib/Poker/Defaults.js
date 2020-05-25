"use strict";
exports.__esModule = true;
var Utils_1 = require("Utils");
var BoolParam = (function () {
    function BoolParam(name, displayName, DEFAULT) {
        this.name = name;
        this.displayName = displayName;
        this.DEFAULT = DEFAULT;
        this.type = "bool";
    }
    BoolParam.prototype.validate = function (originalValue) {
        return originalValue === "off" ? false : !!originalValue;
    };
    return BoolParam;
}());
var IntParam = (function () {
    function IntParam(name, displayName, MIN, DEFAULT, MAX) {
        this.name = name;
        this.displayName = displayName;
        this.MIN = MIN;
        this.DEFAULT = DEFAULT;
        this.MAX = MAX;
        this.type = "int";
    }
    IntParam.prototype.validate = function (originalValue) {
        var value = parseInt(originalValue);
        if (isNaN(value)) {
            throw new Error("value '" + originalValue + "' for '" + this.name + "' is not an int");
        }
        if (Utils_1.clamp(this.MIN, value, this.MAX) !== value) {
            throw new Error("value '" + value + "' for '" + this.name + "' is outside range " + this.MIN + " to " + this.MAX);
        }
        return value;
    };
    return IntParam;
}());
var FloatParam = (function () {
    function FloatParam(name, displayName, MIN, DEFAULT, MAX, PRECISION) {
        if (PRECISION === void 0) { PRECISION = 2; }
        this.name = name;
        this.displayName = displayName;
        this.MIN = MIN;
        this.DEFAULT = DEFAULT;
        this.MAX = MAX;
        this.PRECISION = PRECISION;
        this.type = "float";
    }
    FloatParam.prototype.validate = function (originalValue) {
        var offset = Math.pow(10, this.PRECISION);
        var value = Math.round((parseFloat(originalValue) + Number.EPSILON) * offset) /
            offset;
        if (isNaN(value)) {
            throw new Error("value '" + originalValue + "' for '" + this.name + "' is not a float");
        }
        if (Utils_1.clamp(this.MIN, value, this.MAX) !== value) {
            throw new Error("value '" + value + "' for '" + this.name + "' is outside range " + this.MIN + " to " + this.MAX);
        }
        return value;
    };
    return FloatParam;
}());
var StrParam = (function () {
    function StrParam(name, displayName, PATTERN, DEFAULT) {
        this.name = name;
        this.displayName = displayName;
        this.PATTERN = PATTERN;
        this.DEFAULT = DEFAULT;
        this.type = "str";
    }
    StrParam.prototype.validate = function (originalValue) {
        if (!originalValue.toString().test(this.PATTERN)) {
            throw new Error("value '" + originalValue + "' for '" + this.name + "' doesn't match pattern " + this.PATTERN);
        }
        return originalValue;
    };
    return StrParam;
}());
exports.StrParam = StrParam;
exports.CAPACITY = new IntParam("capacity", "capacity", 2, 4, 16);
exports.AUTOPLAY_INTERVAL = new IntParam("autoplayInterval", "autoplay interval", 0, 10, 60);
exports.MINIMUM_BET = new FloatParam("minimumBet", "minimum bet", 0.01, 1.00, 10.00);
exports.USE_BLINDS = new BoolParam("useBlinds", "use blinds", true);
exports.BIG_BLIND_BET = new FloatParam("bigBlindBet", "big blind bet", exports.MINIMUM_BET.MIN, exports.MINIMUM_BET.DEFAULT, 10 * exports.MINIMUM_BET.MAX);
exports.SMALL_BLIND_BET = new FloatParam("smallBlindBet", "small blind bet", exports.MINIMUM_BET.MIN / 2, exports.MINIMUM_BET.DEFAULT / 2, 50 * exports.MINIMUM_BET.MAX);
exports.USE_ANTES = new BoolParam("useAntes", "use antes", true);
exports.ANTE_BET = new FloatParam("anteBet", "ante bet", exports.MINIMUM_BET.MIN / 2, exports.MINIMUM_BET.DEFAULT, exports.MINIMUM_BET.MAX);
exports.PARAMS = [
    exports.CAPACITY,
    exports.AUTOPLAY_INTERVAL,
    exports.MINIMUM_BET,
    exports.USE_BLINDS,
    exports.BIG_BLIND_BET,
    exports.SMALL_BLIND_BET,
    exports.USE_ANTES,
    exports.ANTE_BET,
];
exports.ADD_BALANCE = new FloatParam("addBalance", "add balance", exports.MINIMUM_BET.MIN, 20.00, 10 * exports.MINIMUM_BET.MAX);
//# sourceMappingURL=Defaults.js.map