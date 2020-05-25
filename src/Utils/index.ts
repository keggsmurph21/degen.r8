// Implementation of Fisher-Yates / Knuth shuffle.  Shuffles an array in-place.
export function shuffled<T>(arr: T[]): T[] {
    for (let i = arr.length; i > 0;) {
        let j = Math.floor(Math.random() * i);
        --i;
        let tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}

// Implementation of Python's zip() builtin for two sequences that returns a
// list of tuples, where the i-th element is the i-th element from each of the
// input seqn's.
//
// NB: Python's implementation can zip an arbitrary number of sequences, whereas
// this only supports two!
export function zip<T, U>(ts: T[], us: U[]): [T, U][] {
    let ret: [T, U][] = [];
    const len = Math.min(ts.length, us.length);
    for (let i = 0; i < len; ++i)
        ret.push([ts[i], us[i]]);
    return ret;
}

// Take an array and return an array of arrays, where each subarray contains
// only elements that "compare" equal.  The subarrays are also guaranteed to be
// ordered by the comparator.
//
// NB: The comparator should be commutative!
export function sortIntoTiers<T>(ts: T[],
                                 comparator: (t0: T, t1: T) => number): T[][] {
    const sortedTs = ts.sort(comparator);
    if (ts.length === 0)
        return [];
    let tiers = [];
    let lastValue = sortedTs.shift();
    let tier = [lastValue];
    sortedTs.forEach(t => {
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

export function clamp(min: number, value: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

// Permute (cycle thru) elements rightwards in an array <permuteBy> times.  For
// example:
//
//   permute([1, 2, 3], 1); // yields [3, 1, 2]
//
export function permute<T>(ts: T[], permuteBy: number): T[] {
    if (ts.length === 0)
        return ts;
    let normalizedPermuteBy = permuteBy;
    while (normalizedPermuteBy < 0)
        normalizedPermuteBy += ts.length;
    while (normalizedPermuteBy >= ts.length)
        normalizedPermuteBy -= ts.length;
    let ret = new Array(ts.length);
    for (let i = 0; i < ts.length; ++i) {
        let permutedIndex = i - normalizedPermuteBy;
        if (permutedIndex < 0)
            permutedIndex += ts.length;
        ret[i] = ts[permutedIndex];
    }
    return ret;
}

// Return the first element in an array satisfying <predicate>, or null if none
// match.
export function findFirst<T>(ts: T[], predicate: (t: T, i: number, ts: T[]) =>
                                          boolean): T|null {
    if (!ts)
        return null;
    return ts.filter(predicate)[0] || null;
}

// Get a random integer in the range [min, max) (i.e., not right-inclusive)
export function randomInRange(min: number, max: number): number {
    return min + Math.floor((max - min) * Math.random());
}
