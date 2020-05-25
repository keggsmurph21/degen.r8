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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var SVG_1 = require("../SVG");
var Constants_1 = require("./Constants");
var EmptySeat_1 = require("./EmptySeat");
var Seat_1 = require("./Seat");
function rotatedPosition(index, nPlayers, radius) {
    var theta = index * 2 * Math.PI / nPlayers - Math.PI / 2;
    var x = 1.3 * Math.cos(theta) * radius;
    var y = Math.sin(theta) * radius;
    return [x, y];
}
function scaleFor(nPlayers) { return 1.35 - nPlayers * 0.05; }
var SeatsWidget = (function (_super) {
    __extends(SeatsWidget, _super);
    function SeatsWidget(data, onClick) {
        var _this = _super.call(this, data) || this;
        _this.container = SVG_1.createSVGElement("g");
        data.seats.forEach(function (seatData, i) {
            var radius = Constants_1.tableRadius * 1.25;
            var _a = __read(rotatedPosition(i, data.seats.length, radius), 2), x = _a[0], y = _a[1];
            var scale = scaleFor(data.seats.length);
            var seatWidget;
            if (seatData.isAvailable) {
                seatWidget = new EmptySeat_1.EmptySeatWidget({ index: i, canSit: seatData.canSit }, onClick);
            }
            else {
                seatWidget = new Seat_1.SeatWidget(seatData.seat);
            }
            seatWidget.transform({ translate: { x: x, y: y }, scale: scale });
            _this.container.appendChild(seatWidget.container);
        });
        return _this;
    }
    return SeatsWidget;
}(SVG_1.SVGWidget));
exports.SeatsWidget = SeatsWidget;
//# sourceMappingURL=Seats.js.map