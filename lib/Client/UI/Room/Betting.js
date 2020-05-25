"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var SVG_1 = require("../SVG");
var Button_1 = require("./Button");
var Constants_1 = require("./Constants");
var BettingWidget = (function (_super) {
    __extends(BettingWidget, _super);
    function BettingWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        _this.addBalanceSliderButton = new Button_1.SliderButtonWidget({
            buttonText: "add balance",
            input: __assign(__assign({}, data.addBalance), { id: "add-balance-amount", labelText: "add balance amount", step: 0.01 })
        }, onClick);
        _this.container.appendChild(_this.addBalanceSliderButton.container);
        if (data.raise) {
            _this.addBalanceSliderButton.transform({ translate: { x: -Constants_1.tableRadius * 1.4 } });
            _this.foldButton = new Button_1.ButtonWidget({ buttonText: "fold" }, onClick);
            _this.foldButton.transform({ translate: { x: -Constants_1.tableRadius * 0.4 } });
            _this.container.appendChild(_this.foldButton.container);
            _this.callButton = new Button_1.ButtonWidget({ buttonText: "call" }, onClick);
            _this.callButton.transform({ translate: { x: Constants_1.tableRadius * 0.4 } });
            _this.container.appendChild(_this.callButton.container);
            _this.raiseSliderButton = new Button_1.SliderButtonWidget({
                buttonText: "raise",
                input: __assign(__assign({}, data.raise), { id: "raise-amount", labelText: "raise amount", step: 0.01 })
            }, onClick);
            _this.raiseSliderButton.transform({ translate: { x: Constants_1.tableRadius * 1.4 } });
            _this.container.appendChild(_this.raiseSliderButton.container);
        }
        return _this;
    }
    return BettingWidget;
}(SVG_1.SVGWidget));
exports.BettingWidget = BettingWidget;
//# sourceMappingURL=Betting.js.map