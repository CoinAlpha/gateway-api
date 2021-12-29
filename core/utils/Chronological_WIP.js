"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chronological = void 0;
var ChronologicalItemStatus;
(function (ChronologicalItemStatus) {
    ChronologicalItemStatus["DORMANT"] = "DORMANT";
    ChronologicalItemStatus["PENDING"] = "PENDING";
    ChronologicalItemStatus["COMPLETE"] = "COMPLETE";
})(ChronologicalItemStatus || (ChronologicalItemStatus = {}));
var ChronologicalItemExitStatus;
(function (ChronologicalItemExitStatus) {
    ChronologicalItemExitStatus["SUCCESS"] = "SUCCESS";
    ChronologicalItemExitStatus["FAILED"] = "FAILED";
    ChronologicalItemExitStatus["UNSET"] = "UNSET";
})(ChronologicalItemExitStatus || (ChronologicalItemExitStatus = {}));
class Chronological {
    constructor(_currentItem) {
        this._currentItem = _currentItem;
        this._items = [];
        this._currentIndex = 0;
    }
    get currentItem() {
        return this._currentItem;
    }
    get currentIndex() {
        return this._currentIndex;
    }
    get items() {
        return this._items;
    }
    get length() {
        return this._items.length;
    }
    get isEmpty() {
        return this._items.length === 0;
    }
    get isFirst() {
        return this._currentIndex === 0;
    }
    get isLast() {
        return this._currentIndex === this._items.length - 1;
    }
    get isInProgress() {
        return this._currentItem !== undefined;
    }
    get isFinished() {
        return this._currentItem === undefined;
    }
}
exports.Chronological = Chronological;
//# sourceMappingURL=Chronological_WIP.js.map