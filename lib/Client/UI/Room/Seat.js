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
var Caption_1 = require("./Caption");
var Constants_1 = require("./Constants");
var Hand_1 = require("./Hand");
var SeatWidget = (function (_super) {
    __extends(SeatWidget, _super);
    function SeatWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        _this.caption = new Caption_1.CaptionWidget(data.caption);
        _this.container.appendChild(_this.caption.container);
        if (data.hand != null) {
            var offsetY = Constants_1.cardHeight * 3 / 7;
            _this.caption.transform({ translate: { y: -offsetY } });
            _this.hand = new Hand_1.HandWidget(data.hand);
            _this.hand.transform({ translate: { y: offsetY } });
            _this.container.appendChild(_this.hand.container);
        }
        return _this;
    }
    return SeatWidget;
}(SVG_1.SVGWidget));
exports.SeatWidget = SeatWidget;
//# sourceMappingURL=Seat.js.map