export declare type StorageServiceContext = {};
export default function createStorageService(ctx: StorageServiceContext): {
    getJSONItem<T>(key: string): T | undefined;
    setJSONItem<T_1>(key: string, value: T_1): void;
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
};
