export declare function memoize<F extends (this: any, ...args: any[]) => any, R extends (...args: Parameters<F>) => any>(func: F, resolver?: R): F;
export declare function memoizeSuccessfulPromise<F extends (this: any, ...args: any[]) => any, R extends (...args: Parameters<F>) => any>(func: F, resolver?: R): F;
