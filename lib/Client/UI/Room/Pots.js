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
var Pot_1 = require("./Pot");
var PotsWidget = (function (_super) {
    __extends(PotsWidget, _super);
    function PotsWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        data.forEach(function (pot, i) {
            var padding = 100;
            var offsetX = ((data.length - 1) / 2 - i) * padding;
            var potWidget = new Pot_1.PotWidget(pot);
            potWidget.transform({ translate: { x: offsetX } });
            _this.container.appendChild(potWidget.container);
        });
        return _this;
    }
    return PotsWidget;
}(SVG_1.SVGWidget));
exports.PotsWidget = PotsWidget;
//# sourceMappingURL=Pots.js.map