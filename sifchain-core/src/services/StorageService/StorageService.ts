export type StorageServiceContext = {};

export default function createStorageService(ctx: StorageServiceContext) {
  let storageAllowed = true;
  try {
    window.localStorage.setItem("__siftest", "true");
    window.localStorage.removeItem("__siftest");
  } catch (error) {
    storageAllowed = false;
  }

  if (storageAllowed) {
    return {
      getJSONItem<T>(key: string) {
        try {
          const res = JSON.parse(
            window.localStorage.getItem(key) || "'EMPTY_'",
          );
          if (res === "EMPTY_") return undefined;
          return res as T;
        } catch (error) {
          return undefined;
        }
      },
      setJSONItem<T>(key: string, value: T) {
        window.localStorage.setItem(key, JSON.stringify(value));
      },
      getItem: (key: string) => {
        return window.localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        window.localStorage.setItem(key, value);
      },
    };
  } else {
    let storage = new Map();
    return {
      getJSONItem<T>(key: string) {
        if (!storage.has(key)) return undefined;
        const res = JSON.parse(storage.get(key));
        return res as T;
      },
      setJSONItem<T>(key: string, value: T) {
        storage.set(key, JSON.stringify(value));
      },
      getItem: (key: string) => {
        return String(storage.get(key));
      },
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    };
  }
}
