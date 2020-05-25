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
var SVG_1 = require("../SVG");
var SVGInput_1 = require("../SVGInput");
var ButtonWidget = (function (_super) {
    __extends(ButtonWidget, _super);
    function ButtonWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        var width = 30 + 10 * data.buttonText.length;
        var height = 27;
        var x = -width / 2;
        var y = -19;
        _this.container = SVG_1.createSVGElement("g", {
            classes: ["button"],
            children: [
                SVG_1.createSVGElement("rect", { attrs: { x: x, y: y, width: width, height: height, rx: 10 } }),
                SVG_1.createSVGElement("text", { textContent: data.buttonText, attrs: { x: 0, y: 0 } })
            ]
        });
        _this.container.addEventListener("click", function (_) { onClick(data.buttonText); });
        return _this;
    }
    return ButtonWidget;
}(SVG_1.SVGWidget));
exports.ButtonWidget = ButtonWidget;
var SliderButtonWidget = (function (_super) {
    __extends(SliderButtonWidget, _super);
    function SliderButtonWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        _this.button =
            new ButtonWidget({ buttonText: data.buttonText }, function (name) {
                onClick(name, _this.input.value());
            });
        _this.button.transform({ translate: { y: -15 } });
        _this.container.appendChild(_this.button.container);
        _this.input = new SVGInput_1.EmbeddedFloatInputWidget(data.input);
        _this.input.transform({ translate: { y: -5 } });
        _this.container.appendChild(_this.input.container);
        return _this;
    }
    return SliderButtonWidget;
}(SVG_1.SVGWidget));
exports.SliderButtonWidget = SliderButtonWidget;
//# sourceMappingURL=Button.js.map