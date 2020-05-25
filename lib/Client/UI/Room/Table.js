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
var Betting_1 = require("./Betting");
var Button_1 = require("./Button");
var CommunityCards_1 = require("./CommunityCards");
var Constants_1 = require("./Constants");
var Pots_1 = require("./Pots");
var Seats_1 = require("./Seats");
var TableWidget = (function (_super) {
    __extends(TableWidget, _super);
    function TableWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.communityCards = null;
        _this.pots = null;
        _this.startButton = null;
        _this.betting = null;
        _this.container = SVG_1.createSVGElement("g");
        _this.background = SVG_1.createSVGElement("ellipse", { attrs: { id: "table", rx: 1.3 * Constants_1.tableRadius, ry: Constants_1.tableRadius } });
        _this.container.appendChild(_this.background);
        _this.seats = new Seats_1.SeatsWidget({ seats: data.seats }, onClick);
        _this.container.appendChild(_this.seats.container);
        if (data.showStartButton) {
            _this.startButton = new Button_1.ButtonWidget({ buttonText: "start" }, onClick);
            _this.container.appendChild(_this.startButton.container);
        }
        else {
            if (data.communityCards) {
                _this.communityCards =
                    new CommunityCards_1.CommunityCardsWidget(data.communityCards);
                _this.communityCards.transform({ translate: { y: -Constants_1.tableRadius * 0.1 } });
                _this.container.appendChild(_this.communityCards.container);
            }
            if (data.pots) {
                _this.pots = new Pots_1.PotsWidget(data.pots);
                _this.pots.transform({ translate: { y: Constants_1.tableRadius * 0.3 } });
                _this.container.appendChild(_this.pots.container);
            }
            if (data.betting) {
                _this.betting = new Betting_1.BettingWidget(data.betting, onClick);
                _this.betting.transform({ translate: { y: Constants_1.tableRadius * 1.7 } });
                _this.container.append(_this.betting.container);
            }
        }
        return _this;
    }
    return TableWidget;
}(SVG_1.SVGWidget));
exports.TableWidget = TableWidget;
//# sourceMappingURL=Table.js.map