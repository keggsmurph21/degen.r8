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
var Card_1 = require("Poker/Card");
var SVG_1 = require("../SVG");
var Constants_1 = require("./Constants");
var CardWidget = (function (_super) {
    __extends(CardWidget, _super);
    function CardWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.text = null;
        _this.rankSpan = null;
        _this.suitSpan = null;
        var isFaceUp = data != null;
        _this.container = SVG_1.createSVGElement("g", {
            classes: ["card", isFaceUp ? "card-up" : "card-down"],
            children: [SVG_1.createSVGElement("rect", {
                    attrs: {
                        x: -Constants_1.cardWidth / 2,
                        width: Constants_1.cardWidth,
                        y: -Constants_1.cardHeight / 2,
                        height: Constants_1.cardHeight,
                        rx: 10
                    }
                })]
        });
        if (isFaceUp) {
            _this.text = SVG_1.createSVGElement("text", { classes: [Card_1.displayNameForSuit(data.suit)] });
            _this.container.appendChild(_this.text);
            _this.rankSpan = SVG_1.createSVGElement("tspan", {
                textContent: Card_1.charForRank(data.rank),
                attrs: {
                    x: 0,
                    dy: "-0.1em"
                }
            });
            _this.text.appendChild(_this.rankSpan);
            _this.suitSpan = SVG_1.createSVGElement("tspan", {
                textContent: Card_1.charForSuit(data.suit),
                attrs: {
                    x: 0,
                    dy: "0.8em"
                }
            });
            _this.text.appendChild(_this.suitSpan);
        }
        return _this;
    }
    return CardWidget;
}(SVG_1.SVGWidget));
exports.CardWidget = CardWidget;
//# sourceMappingURL=Card.js.map