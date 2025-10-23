const name = String(process.env.NEXT_PUBLIC_APP_NAME || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") + ".cavity";
const storeName = "cache";
const version = 1;

type CavityType = {
  key     : string;
  data    : any;
  expired : number;
};

async function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const cavity = {
  set: async ({ key, data, expired }: CavityType) => {
    const db = await idb();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    const item = {
      key,
      expired: new Date().getTime() + expired * 60 * 1000, // dalam ms
      data,
    };

    store.put(item);

    return tx.commit;
  },

  get: async (key: string) => {
    const db = await idb();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    return new Promise((resolve) => {
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result;
        if (!item) return resolve(null);

        if (item.expired > Date.now()) {
          resolve(item.data);
        } else {
          // auto delete jika expired
          const deleteTx = db.transaction(storeName, "readwrite");
          deleteTx.objectStore(storeName).delete(key);
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  },

  delete: async (key: string) => {
    const db = await idb();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(key);
    return tx.commit;
  },
};
