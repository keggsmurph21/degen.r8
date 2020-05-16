export class Store<V> {
    private storage: {[key: number]: V} = {};
    get(key: number): V|null { return this.storage[key]; }
    put(key: number, value: V): void { this.storage[key] = value; }
}
