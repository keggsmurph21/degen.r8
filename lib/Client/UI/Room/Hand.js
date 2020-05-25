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
var Card_1 = require("./Card");
var Constants_1 = require("./Constants");
var HandWidget = (function (_super) {
    __extends(HandWidget, _super);
    function HandWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        var offsetX = (Constants_1.cardPaddingX + Constants_1.cardWidth) / 2;
        _this.left = new Card_1.CardWidget(data[0]);
        _this.left.transform({ translate: { x: -offsetX } });
        _this.container.appendChild(_this.left.container);
        _this.right = new Card_1.CardWidget(data[1]);
        _this.right.transform({ translate: { x: offsetX } });
        _this.container.appendChild(_this.right.container);
        return _this;
    }
    return HandWidget;
}(SVG_1.SVGWidget));
exports.HandWidget = HandWidget;
//# sourceMappingURL=Hand.js.map