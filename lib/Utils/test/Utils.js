"use strict";
exports.__esModule = true;
require("mocha");
var chai_1 = require("chai");
var __1 = require("..");
describe("Utils", function () {
    it("sortIntoTiers", function () {
        var intSort = function (a, b) { return a - b; };
        chai_1.expect(__1.sortIntoTiers([], intSort)).to.deep.equal([]);
        chai_1.expect(__1.sortIntoTiers([1], intSort)).to.deep.equal([[1]]);
        chai_1.expect(__1.sortIntoTiers([1, 2], intSort)).to.deep.equal([[1], [2]]);
        chai_1.expect(__1.sortIntoTiers([1, 1], intSort)).to.deep.equal([[1, 1]]);
        var intSortOnKey = function (a, b) { return a.key - b.key; };
        chai_1.expect(__1.sortIntoTiers([{ key: 1 }, { key: 2 }, { key: 2 }, { key: 2 }, { key: 3 }], intSortOnKey))
            .to.deep.equal([[{ key: 1 }], [{ key: 2 }, { key: 2 }, { key: 2 }], [{ key: 3 }]]);
    });
    it("permute", function () {
        chai_1.expect(__1.permute([], 0)).to.deep.equal([]);
        chai_1.expect(__1.permute([], 3)).to.deep.equal([]);
        chai_1.expect(__1.permute([1], 0)).to.deep.equal([1]);
        chai_1.expect(__1.permute([1], 3)).to.deep.equal([1]);
        chai_1.expect(__1.permute([1, 2], 0)).to.deep.equal([1, 2]);
        chai_1.expect(__1.permute([1, 2], 1)).to.deep.equal([2, 1]);
        chai_1.expect(__1.permute([1, 2], 2)).to.deep.equal([1, 2]);
        chai_1.expect(__1.permute([1, 2], 3)).to.deep.equal([2, 1]);
        chai_1.expect(__1.permute([1, 2, 3], 0)).to.deep.equal([1, 2, 3]);
        chai_1.expect(__1.permute([1, 2, 3], 1)).to.deep.equal([3, 1, 2]);
        chai_1.expect(__1.permute([1, 2, 3], 2)).to.deep.equal([2, 3, 1]);
        chai_1.expect(__1.permute([1, 2, 3], 3)).to.deep.equal([1, 2, 3]);
        chai_1.expect(__1.permute([1, 2, 3], -1)).to.deep.equal([2, 3, 1]);
    });
});
//# sourceMappingURL=Utils.js.map