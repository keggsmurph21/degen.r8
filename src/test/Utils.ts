import "mocha";
import {expect} from "chai";

import {sortIntoTiers} from "../Utils";

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
});
