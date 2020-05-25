"use strict";
exports.__esModule = true;
var SVG_1 = require("../SVG");
var Constants_1 = require("./Constants");
var SitButton = (function () {
    function SitButton() {
        var x0 = -Constants_1.cardWidth / 2;
        var y0 = -Constants_1.cardHeight * 3 / 13;
        this.container = SVG_1.createSVGElement("g", {
            classes: ["button button-sit"],
            children: [
                SVG_1.createSVGElement("rect", {
                    attrs: {
                        x: x0,
                        y: y0,
                        width: Constants_1.cardWidth,
                        height: Constants_1.cardHeight / 3,
                        rx: 10
                    }
                }),
                SVG_1.createSVGElement("text", { textContent: "sit", attrs: { x: 0, y: 0 } })
            ]
        });
    }
    SitButton.prototype.update = function (data) { };
    return SitButton;
}());
exports.SitButton = SitButton;
//# sourceMappingURL=SitButton.js.map