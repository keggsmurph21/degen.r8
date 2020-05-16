"use strict";
exports.__esModule = true;
function shuffled(arr) {
    for (var i = arr.length; i > 0;) {
        var j = Math.floor(Math.random() * i);
        --i;
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}
exports.shuffled = shuffled;
function zip(ts, us) {
    var ret = [];
    var len = Math.min(ts.length, us.length);
    for (var i = 0; i < len; ++i)
        ret.push([ts[i], us[i]]);
    return ret;
}
exports.zip = zip;
function sortIntoTiers(ts, comparator) {
    var sortedTs = ts.sort(comparator);
    if (ts.length === 0)
        return [];
    var tiers = [];
    var lastValue = sortedTs.shift();
    var tier = [lastValue];
    sortedTs.forEach(function (t) {
        if (comparator(lastValue, t) === 0) {
            tier.push(t);
            lastValue = t;
            return;
        }
        tiers.push(tier);
        lastValue = t;
        tier = [lastValue];
    });
    tiers.push(tier);
    return tiers;
}
exports.sortIntoTiers = sortIntoTiers;
function clamp(min, value, max) {
    return Math.min(max, Math.max(min, value));
}
exports.clamp = clamp;
function permute(ts, permuteBy) {
    if (ts.length === 0)
        return ts;
    var normalizedPermuteBy = permuteBy;
    while (normalizedPermuteBy < 0)
        normalizedPermuteBy += ts.length;
    while (normalizedPermuteBy >= ts.length)
        normalizedPermuteBy -= ts.length;
    var ret = new Array(ts.length);
    for (var i = 0; i < ts.length; ++i) {
        var permutedIndex = i - normalizedPermuteBy;
        if (permutedIndex < 0)
            permutedIndex += ts.length;
        ret[i] = ts[permutedIndex];
    }
    return ret;
}
exports.permute = permute;
function findFirst(ts, predicate) {
    if (!ts)
        return null;
    return ts.filter(predicate)[0] || null;
}
exports.findFirst = findFirst;
//# sourceMappingURL=Utils.js.map