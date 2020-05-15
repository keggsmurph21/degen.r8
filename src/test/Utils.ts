import "mocha";
import {expect} from "chai";

import {permute, sortIntoTiers} from "../Utils";

describe("Utils", () => {
    it("sortIntoTiers", () => {
        const intSort = (a, b) => a - b;
        expect(sortIntoTiers([], intSort)).to.deep.equal([]);
        expect(sortIntoTiers([1], intSort)).to.deep.equal([[1]]);
        expect(sortIntoTiers([1, 2], intSort)).to.deep.equal([[1], [2]]);
        expect(sortIntoTiers([1, 1], intSort)).to.deep.equal([[1, 1]]);
        const intSortOnKey = (a, b) => a.key - b.key;
        expect(sortIntoTiers([{key: 1}, {key: 2}, {key: 2}, {key: 2}, {key: 3}],
                             intSortOnKey))
            .to.deep.equal(
                [[{key: 1}], [{key: 2}, {key: 2}, {key: 2}], [{key: 3}]]);
    });

    it("permute", () => {
        expect(permute([], 0)).to.deep.equal([]);
        expect(permute([], 3)).to.deep.equal([]);
        expect(permute([1], 0)).to.deep.equal([1]);
        expect(permute([1], 3)).to.deep.equal([1]);
        expect(permute([1, 2], 0)).to.deep.equal([1, 2]);
        expect(permute([1, 2], 1)).to.deep.equal([2, 1]);
        expect(permute([1, 2], 2)).to.deep.equal([1, 2]);
        expect(permute([1, 2], 3)).to.deep.equal([2, 1]);
        expect(permute([1, 2, 3], 0)).to.deep.equal([1, 2, 3]);
        expect(permute([1, 2, 3], 1)).to.deep.equal([3, 1, 2]);
        expect(permute([1, 2, 3], 2)).to.deep.equal([2, 3, 1]);
        expect(permute([1, 2, 3], 3)).to.deep.equal([1, 2, 3]);
        expect(permute([1, 2, 3], -1)).to.deep.equal([2, 3, 1]);
    });
});
