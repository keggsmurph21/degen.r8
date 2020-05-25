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
var CommunityCardsWidget = (function (_super) {
    __extends(CommunityCardsWidget, _super);
    function CommunityCardsWidget(data) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        data.forEach(function (card, i) {
            var dx = (i - 2) * (Constants_1.cardWidth + Constants_1.cardPaddingX);
            var cardElement = new Card_1.CardWidget(card);
            cardElement.transform({ translate: { x: dx } });
            _this.container.appendChild(cardElement.container);
        });
        return _this;
    }
    return CommunityCardsWidget;
}(SVG_1.SVGWidget));
exports.CommunityCardsWidget = CommunityCardsWidget;
//# sourceMappingURL=CommunityCards.js.map