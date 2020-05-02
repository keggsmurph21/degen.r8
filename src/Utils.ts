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
