"use strict";
exports.__esModule = true;
var Store = (function () {
    function Store() {
        this.storage = {};
    }
    Store.prototype.get = function (key) { return this.storage[key]; };
    Store.prototype.put = function (key, value) { this.storage[key] = value; };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=Store.js.map