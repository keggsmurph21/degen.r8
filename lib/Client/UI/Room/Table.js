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
function toTableData(view, usernameLookup) {
    var seats = view.sitting.map(function (playerId) {
        if (playerId == null) {
            return {
                isAvailable: true,
                canSit: !view.isSitting,
                seat: null,
                isCurrentPlayer: false
            };
        }
        var caption = {
            username: usernameLookup(playerId),
            balance: view.balances[playerId]
        };
        var hand = null;
        var isCurrentPlayer = false;
        if (view.round != null) {
            view.round.playerStates.forEach(function (ps) {
                if (hand !== null)
                    return;
                if (ps.playerId !== playerId)
                    return;
                hand = ps.holeCards;
                isCurrentPlayer = view.isCurrentPlayer;
            });
        }
        return {
            isAvailable: false,
            canSit: false,
            seat: { caption: caption, hand: hand },
            isCurrentPlayer: isCurrentPlayer
        };
    });
    var communityCards = null;
    var betting = {
        addBalance: {
            min: 10 * view.params.bigBlindBet,
            "default": 20.00,
            max: 100 * view.params.bigBlindBet
        },
        raise: null,
        isCurrentPlayer: view.isCurrentPlayer
    };
    var pots = null;
    if (view.round != null) {
        communityCards = view.round.communityCards;
        var maxBet = view.balances[view.playerId];
        if (view.isPlaying) {
            betting.raise = {
                min: view.params.minimumBet,
                "default": Math.min(5 * view.params.minimumBet, maxBet),
                max: maxBet
            };
        }
        pots = view.round.pots.map(function (pot) { return { contributions: pot.contributions }; });
    }
    var tableData = {
        nPlayers: view.sitting.length,
        showStartButton: view.canStartRound,
        communityCards: communityCards,
        seats: seats,
        betting: betting,
        pots: pots
    };
    console.log("converted", view, "=>", tableData);
    return tableData;
}
var TableWidget = (function (_super) {
    __extends(TableWidget, _super);
    function TableWidget(view, usernameLookup, onClick) {
        var _this = _super.call(this, view) || this;
        _this.usernameLookup = usernameLookup;
        _this.onClick = onClick;
        _this.communityCards = null;
        _this.pots = null;
        _this.startButton = null;
        _this.betting = null;
        _this.container = SVG_1.createSVGElement("g");
        _this.update(view);
        return _this;
    }
    TableWidget.prototype.update = function (view) {
        SVG_1.removeChildren(this.container);
        var data = toTableData(view, this.usernameLookup);
        this.background = SVG_1.createSVGElement("ellipse", { attrs: { id: "table", rx: 1.3 * Constants_1.tableRadius, ry: Constants_1.tableRadius } });
        this.container.appendChild(this.background);
        this.seats = new Seats_1.SeatsWidget({ seats: data.seats }, this.onClick);
        this.container.appendChild(this.seats.container);
        if (data.showStartButton) {
            this.startButton =
                new Button_1.ButtonWidget({ buttonText: "start" }, this.onClick);
            this.container.appendChild(this.startButton.container);
        }
        else {
            if (data.communityCards) {
                this.communityCards =
                    new CommunityCards_1.CommunityCardsWidget(data.communityCards);
                this.communityCards.transform({ translate: { y: -Constants_1.tableRadius * 0.1 } });
                this.container.appendChild(this.communityCards.container);
            }
            if (data.pots) {
                this.pots = new Pots_1.PotsWidget(data.pots);
                this.pots.transform({ translate: { y: Constants_1.tableRadius * 0.3 } });
                this.container.appendChild(this.pots.container);
            }
        }
        this.betting = new Betting_1.BettingWidget(data.betting, this.onClick);
        this.betting.transform({ translate: { y: Constants_1.tableRadius * 1.7 } });
        this.container.append(this.betting.container);
    };
    return TableWidget;
}(SVG_1.SVGWidget));
exports.TableWidget = TableWidget;
//# sourceMappingURL=Table.js.map