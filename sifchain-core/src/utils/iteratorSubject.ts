import { defer } from "./defer";

export function createIteratorSubject<T>() {
  const buffer: T[] = [];
  let deferred = defer<null>();
  let aborted = false;

  async function* generate(): AsyncGenerator<T> {
    while (!aborted) {
      while (buffer.length) {
        const value = buffer.shift();
        if (value != null) yield value;
      }
      await deferred.promise;
    }
  }

  function feed(value: T) {
    if (aborted) throw new Error("Cannot feed value after abort!");
    buffer.push(value);
    deferred?.resolve();
    deferred = defer();
  }

  function end() {
    if (aborted) throw new Error("Already aborted");
    aborted = true;
    deferred?.resolve();
  }

  return {
    iterator: generate(),
    feed,
    end,
  };
}
