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
exports.__esModule = true;
var Input_1 = require("../Input");
var SVG_1 = require("../SVG");
var Button_1 = require("./Button");
var Constants_1 = require("./Constants");
var BettingWidget = (function (_super) {
    __extends(BettingWidget, _super);
    function BettingWidget(onClick) {
        var _this = _super.call(this) || this;
        _this.container = SVG_1.createSVGElement("g");
        var DEFAULT_ADD_BALANCE_AMOUNT = 20.00;
        var MIN_ADD_BALANCE_AMOUNT = 0.01;
        var MAX_ADD_BALANCE_AMOUNT = 100.00;
        _this.addBalanceSliderButton = new Button_1.SliderButtonWidget("add balance", new Input_1.FloatInputWidget("add-balance-amount", "add balance amount", DEFAULT_ADD_BALANCE_AMOUNT, MIN_ADD_BALANCE_AMOUNT, MAX_ADD_BALANCE_AMOUNT, 0.01), onClick);
        _this.addBalanceSliderButton.transform({ translate: { x: -Constants_1.tableRadius * 1.4 } });
        _this.container.appendChild(_this.addBalanceSliderButton.container);
        _this.foldButton = new Button_1.ButtonWidget("fold", onClick);
        _this.foldButton.transform({ translate: { x: -Constants_1.tableRadius * 0.4 } });
        _this.container.appendChild(_this.foldButton.container);
        _this.callButton = new Button_1.ButtonWidget("call", onClick);
        _this.callButton.transform({ translate: { x: Constants_1.tableRadius * 0.4 } });
        _this.container.appendChild(_this.callButton.container);
        var DEFAULT_RAISE_AMOUNT = 1.0;
        var MIN_RAISE_AMOUNT = 0.01;
        var MAX_RAISE_AMOUNT = 100.0;
        _this.raiseSliderButton = new Button_1.SliderButtonWidget("raise", new Input_1.FloatInputWidget("raise-amount", "raise amount", DEFAULT_RAISE_AMOUNT, MIN_RAISE_AMOUNT, MAX_RAISE_AMOUNT, 0.01), onClick);
        _this.raiseSliderButton.transform({ translate: { x: Constants_1.tableRadius * 1.4 } });
        _this.container.appendChild(_this.raiseSliderButton.container);
        return _this;
    }
    BettingWidget.prototype.update = function (data) {
        this.addBalanceSliderButton.update(data.addBalance);
        this.raiseSliderButton.update(data.raise);
    };
    return BettingWidget;
}(SVG_1.SVGWidget));
exports.BettingWidget = BettingWidget;
//# sourceMappingURL=BettingInterface.js.map