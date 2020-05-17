"use strict";
exports.__esModule = true;
var Utils_1 = require("Utils");
var ParamType;
(function (ParamType) {
    ParamType[ParamType["Bool"] = 0] = "Bool";
    ParamType[ParamType["Int"] = 1] = "Int";
    ParamType[ParamType["Float"] = 2] = "Float";
    ParamType[ParamType["Str"] = 3] = "Str";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
var BoolParam = (function () {
    function BoolParam(DEFAULT) {
        this.DEFAULT = DEFAULT;
        this.type = ParamType.Bool;
    }
    BoolParam.prototype.validate = function (originalValue) {
        return originalValue === "off" ? false : !!originalValue;
    };
    return BoolParam;
}());
var IntParam = (function () {
    function IntParam(MIN, DEFAULT, MAX) {
        this.MIN = MIN;
        this.DEFAULT = DEFAULT;
        this.MAX = MAX;
        this.type = ParamType.Int;
    }
    IntParam.prototype.validate = function (originalValue) {
        var value = parseInt(originalValue);
        if (isNaN(value))
            throw new Error("value '" + originalValue + "' is not an int");
        if (Utils_1.clamp(this.MIN, value, this.MAX) !== value)
            throw new Error("value '" + value + "' is outside range " + this.MIN + " to " + this.MAX);
        return value;
    };
    return IntParam;
}());
var FloatParam = (function () {
    function FloatParam(MIN, DEFAULT, MAX, PRECISION) {
        if (PRECISION === void 0) { PRECISION = 2; }
        this.MIN = MIN;
        this.DEFAULT = DEFAULT;
        this.MAX = MAX;
        this.PRECISION = PRECISION;
        this.type = ParamType.Float;
    }
    FloatParam.prototype.validate = function (originalValue) {
        var offset = Math.pow(10, this.PRECISION);
        var value = Math.round((parseFloat(originalValue) + Number.EPSILON) * offset) /
            offset;
        if (isNaN(value))
            throw new Error("value '" + originalValue + "' is not a float");
        if (Utils_1.clamp(this.MIN, value, this.MAX) !== value)
            throw new Error("value '" + value + "' is outside range " + this.MIN + " to " + this.MAX);
        return value;
    };
    return FloatParam;
}());
var StrParam = (function () {
    function StrParam(PATTERN, DEFAULT) {
        this.PATTERN = PATTERN;
        this.DEFAULT = DEFAULT;
        this.type = ParamType.Str;
    }
    StrParam.prototype.validate = function (originalValue) {
        if (!originalValue.toString().test(this.PATTERN))
            throw new Error("value '" + originalValue + "' doesn't match pattern " + this.PATTERN);
        return originalValue;
    };
    return StrParam;
}());
exports.StrParam = StrParam;
exports.CAPACITY = new IntParam(2, 4, 16);
exports.AUTOPLAY_INTERVAL = new IntParam(0, 10, 60);
exports.MINIMUM_BET = new FloatParam(0.01, 1.00, 10.00);
exports.USE_BLINDS = new BoolParam(true);
exports.BIG_BLIND_BET = new FloatParam(exports.MINIMUM_BET.MIN, exports.MINIMUM_BET.DEFAULT, 10 * exports.MINIMUM_BET.MAX);
exports.SMALL_BLIND_BET = new FloatParam(exports.MINIMUM_BET.MIN / 2, exports.MINIMUM_BET.DEFAULT / 2, 50 * exports.MINIMUM_BET.MAX);
exports.USE_ANTES = new BoolParam(true);
exports.ANTE_BET = new FloatParam(exports.MINIMUM_BET.MIN / 2, exports.MINIMUM_BET.DEFAULT, exports.MINIMUM_BET.MAX);
exports.ADD_BALANCE = new FloatParam(exports.MINIMUM_BET.MIN, 20.00, 10 * exports.MINIMUM_BET.MAX);
//# sourceMappingURL=Defaults.js.map