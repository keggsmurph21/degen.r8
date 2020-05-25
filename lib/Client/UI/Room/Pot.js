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
var PotWidget = (function (_super) {
    __extends(PotWidget, _super);
    function PotWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container =
            SVG_1.createSVGElement("text", { classes: ["caption"] });
        var sum = data.contributions.reduce(function (acc, contrib) { return acc += contrib; }, 0);
        _this.container.textContent = sum.toFixed(2);
        return _this;
    }
    return PotWidget;
}(SVG_1.SVGWidget));
exports.PotWidget = PotWidget;
//# sourceMappingURL=Pot.js.map