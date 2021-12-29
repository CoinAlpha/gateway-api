export declare function defer<T>(): {
    promise: Promise<T | undefined>;
    resolve: (t?: T | undefined) => void;
    reject: (err?: any) => void;
};
