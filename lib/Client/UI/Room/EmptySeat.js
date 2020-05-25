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
var Button_1 = require("./Button");
var EmptySeatWidget = (function (_super) {
    __extends(EmptySeatWidget, _super);
    function EmptySeatWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.text = null;
        _this.sitButton = null;
        _this.container = SVG_1.createSVGElement("g");
        if (data.canSit) {
            _this.sitButton = new Button_1.ButtonWidget({ buttonText: "sit" }, function (name) { onClick(name, data.index); });
            _this.container.appendChild(_this.sitButton.container);
        }
        else {
            _this.text = SVG_1.createSVGElement("text", {
                textContent: "\u2013",
                classes: ["caption", "caption-empty"],
                attrs: { x: 0, y: 0 }
            });
            _this.container.appendChild(_this.text);
        }
        return _this;
    }
    return EmptySeatWidget;
}(SVG_1.SVGWidget));
exports.EmptySeatWidget = EmptySeatWidget;
//# sourceMappingURL=EmptySeat.js.map