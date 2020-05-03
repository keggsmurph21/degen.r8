export function shuffled<T>(arr: T[]): T[] {
    // Implementation of Fisher-Yates / Knuth shuffle.  Shuffles
    // an array in-place.
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
