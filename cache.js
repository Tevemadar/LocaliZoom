class LRUCache {
    #map = new Map;
    #capacity;
    constructor(capacity) {
        this.#capacity = capacity;
    }
    get(key) {
        if (!this.#map.has(key))
            return null;
        const value = this.#map.get(key);
        this.#map.delete(key);
        this.#map.set(key, value);
        return value;
    }
    put(key, value) {
        while (this.#map.size >= this.#capacity)
            this.#map.delete(this.#map.keys().next().value);
        this.#map.set(key, value);
    }
}
