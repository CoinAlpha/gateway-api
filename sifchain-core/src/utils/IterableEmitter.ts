import { EventEmitter } from "events";
import { createIteratorSubject } from "./iteratorSubject";

const VALUE_EVENT = "value";
const END_EVENT = "end";

export class IterableEmitter<EventType> {
  private isEnded = false;

  private emitter = new EventEmitter();
  subject = createIteratorSubject<EventType>();

  private listen<T>(eventName: string, callback: (value: T) => void) {
    if (this.isEnded) throw new Error("Cannot listen after ended!");
    this.emitter.on(eventName, callback);
    const unlisten = () => {
      this.emitter.off(eventName, callback);
    };
    return unlisten;
  }

  onValue(callback: (value: EventType) => void) {
    return this.listen<EventType>(VALUE_EVENT, callback);
  }

  onEnd(callback: () => void) {
    return this.listen<void>(END_EVENT, callback);
  }

  generator() {
    return this.subject.iterator;
  }

  emit(event: EventType) {
    if (this.isEnded) {
      throw new Error(
        `Cannot emit event ${event} after IterableEmitter is complete!`,
      );
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
