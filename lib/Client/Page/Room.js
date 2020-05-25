"use strict";
exports.__esModule = true;
var Utils_1 = require("Utils");
var Constants_1 = require("../UI/Room/Constants");
var Table_1 = require("../UI/Room/Table");
var SVG_1 = require("../UI/SVG");
function getRandomUsername() {
    var username = "";
    var len = Utils_1.randomInRange(6, 25);
    for (var i = 0; i < len; ++i) {
        var ch = String.fromCharCode(Utils_1.randomInRange(98, 123));
        username += ch;
    }
    return username;
}
function massage(view) {
    console.log(view);
    var seats = view.sitting.map(function (playerId) {
        if (playerId == null) {
            return { isAvailable: true, canSit: !view.isSitting, seat: null };
        }
        var caption = {
            username: getRandomUsername(),
            balance: view.balances[playerId]
        };
        var hand = null;
        if (view.round != null) {
            view.round.playerStates.forEach(function (ps) {
                if (hand !== null)
                    return;
                if (ps.playerId !== playerId)
                    return;
                hand = ps.holeCards;
            });
        }
        return { isAvailable: false, canSit: false, seat: { caption: caption, hand: hand } };
    });
    var communityCards = null;
    var betting = null;
    var pots = null;
    if (view.round != null) {
        communityCards = view.round.communityCards;
        var maxBet = view.balances[view.playerId];
        if (view.isPlaying) {
            betting = {
                addBalance: {
                    min: 10 * view.params.bigBlindBet,
                    "default": 20.00,
                    max: 100 * view.params.bigBlindBet
                },
                raise: {
                    min: view.params.minimumBet,
                    "default": Math.min(5 * view.params.minimumBet, maxBet),
                    max: maxBet
                }
            };
        }
        pots = view.round.pots.map(function (pot) { return { contributions: pot.contributions }; });
    }
    return {
        nPlayers: view.sitting.length,
        showStartButton: view.canStartRound,
        communityCards: communityCards,
        seats: seats,
        betting: betting,
        pots: pots
    };
}
window.main = function (view) {
    var container = document.getElementById("table-container");
    SVG_1.removeChildren(container);
    var svg = SVG_1.createSVGElement("svg", {
        attrs: {
            xmlns: SVG_1.SVG_NS,
            viewBox: Constants_1.viewBox,
            height: "100%",
            width: "100%"
        }
    });
    container.appendChild(svg);
    var data = massage(view);
    console.log(data);
    var table = new Table_1.TableWidget(data, console.log);
    table.transform({ translate: { y: -Constants_1.tableRadius * 0.2 } });
    svg.appendChild(table.container);
};
//# sourceMappingURL=Room.js.map