export declare function debounce<T extends unknown[], U>(callback: (...args: T) => PromiseLike<U> | U, wait: number): (...args: T) => Promise<U>;
