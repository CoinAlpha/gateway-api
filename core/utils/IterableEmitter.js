"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IterableEmitter = void 0;
const events_1 = require("events");
const iteratorSubject_1 = require("./iteratorSubject");
const VALUE_EVENT = "value";
const END_EVENT = "end";
class IterableEmitter {
    constructor() {
        this.isEnded = false;
        this.emitter = new events_1.EventEmitter();
        this.subject = iteratorSubject_1.createIteratorSubject();
    }
    listen(eventName, callback) {
        if (this.isEnded)
            throw new Error("Cannot listen after ended!");
        this.emitter.on(eventName, callback);
        const unlisten = () => {
            this.emitter.off(eventName, callback);
        };
        return unlisten;
    }
    onValue(callback) {
        return this.listen(VALUE_EVENT, callback);
    }
    onEnd(callback) {
        return this.listen(END_EVENT, callback);
    }
    generator() {
        return this.subject.iterator;
    }
    emit(event) {
        if (this.isEnded) {
            throw new Error(`Cannot emit event ${event} after IterableEmitter is complete!`);
        }
        this.subject.feed(event);
        this.emitter.emit(VALUE_EVENT, event);
    }
    end() {
        this.isEnded = true;
        this.emitter.removeAllListeners();
        this.emitter.emit(END_EVENT);
        this.subject.end();
    }
}
exports.IterableEmitter = IterableEmitter;
//# sourceMappingURL=IterableEmitter.js.map