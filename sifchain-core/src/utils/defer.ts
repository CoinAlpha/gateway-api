export function defer<T>() {
  let resolve: (T?: any) => void, reject: (err: any) => void;

  const promise = new Promise<T | undefined>((_1, _2) => {
    resolve = _1;
    reject = _2;
  });
  return {
    promise,
    resolve: (t?: T) => resolve?.(t),
    reject: (err?: any) => reject?.(err),
  };
}
