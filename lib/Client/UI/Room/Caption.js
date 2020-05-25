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
var CaptionWidget = (function (_super) {
    __extends(CaptionWidget, _super);
    function CaptionWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("text", {
            classes: ["caption"]
        });
        _this.usernameSpan = SVG_1.createSVGElement("tspan", {
            classes: ["username"],
            textContent: data.username,
            attrs: { x: 0, dy: "-0.2em" }
        });
        _this.container.appendChild(_this.usernameSpan);
        _this.balanceSpan = SVG_1.createSVGElement("tspan", {
            classes: ["balance"],
            textContent: data.balance.toFixed(2),
            attrs: { x: 0, dy: "1.3em" }
        });
        _this.container.appendChild(_this.balanceSpan);
        return _this;
    }
    return CaptionWidget;
}(SVG_1.SVGWidget));
exports.CaptionWidget = CaptionWidget;
//# sourceMappingURL=Caption.js.map