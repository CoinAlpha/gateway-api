export declare function createIteratorSubject<T>(): {
    iterator: AsyncGenerator<T, any, unknown>;
    feed: (value: T) => void;
    end: () => void;
};
