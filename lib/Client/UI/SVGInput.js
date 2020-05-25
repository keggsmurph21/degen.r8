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
var Input_1 = require("./Input");
var SVG_1 = require("./SVG");
var EmbeddedFloatInputWidget = (function (_super) {
    __extends(EmbeddedFloatInputWidget, _super);
    function EmbeddedFloatInputWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("foreignObject", { classes: ["caption", "wrapped-input"] });
        _this.floatInputWidget = new Input_1.FloatInputWidget(data);
        _this.container.appendChild(_this.floatInputWidget.container);
        return _this;
    }
    EmbeddedFloatInputWidget.prototype.value = function () { return this.floatInputWidget.value(); };
    return EmbeddedFloatInputWidget;
}(SVG_1.SVGWidget));
exports.EmbeddedFloatInputWidget = EmbeddedFloatInputWidget;
//# sourceMappingURL=SVGInput.js.map