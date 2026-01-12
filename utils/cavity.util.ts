import { socket as s, logger } from "@utils";

const name           =  String(process.env.NEXT_PUBLIC_APP_NAME || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") + ".cavity";
const storeName      =  "cache";
const version        =  1;

const subscriptions  =  new Set<string>();
const socket         =  process.env.NEXT_PUBLIC_SOCKET_URL ? s.connect() : null;
let   registered     =  false;

type CavityType = {
  key      :  string;
  data     :  any;
  expired  :  number;
};

// ==============================>
// ## Init indexDb
// ==============================>
async function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" });
      }
    };

    request.onsuccess  =  () => resolve(request.result);
    request.onerror    =  () => reject(request.error);
  });
}

export const cavity = {
  // ==============================>
  // ## Set cache to indexDb
  // ==============================>
  set: async ({ key, data, expired }: CavityType) => {
    const db     =  await idb();
    const tx     =  db.transaction(storeName, "readwrite");
    const store  =  tx.objectStore(storeName);

    const item = {
      key,
      expired: new Date().getTime() + expired * 60 * 1000,
      data,
    };

    store.put(item);

    return tx.commit;
  },

  // ==============================>
  // ## Get cache from indexDb
  // ==============================>
  get: async (key: string) : Promise<{ message: string, data: Record<string, any> }> => {
    const db     =  await idb();
    const tx     =  db.transaction(storeName, "readonly");
    const store  =  tx.objectStore(storeName);

    return new Promise((resolve) => {
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result;
        if (!item) return resolve({ message: "Record not found!", data: [] });

        if (item.expired > Date.now()) {
          resolve(item.data);
        } else {
          const deleteTx = db.transaction(storeName, "readwrite");
          deleteTx.objectStore(storeName).delete(key);
          resolve({ message: "Record not found!", data: [] });
        }
      };

      request.onerror = () => resolve({ message: "Error!", data: [] });
    });
  },

  // ==============================>
  // ## Remove cache from indexDb
  // ==============================>
  delete: async (key: string) => {
    const db     =  await idb();
    const tx     =  db.transaction(storeName, "readwrite");
    const store  =  tx.objectStore(storeName);

    store.delete(key);
    return tx.commit;
  },

  socket: {
    register: () => {
      if (registered || !s) return;
      registered = true;

      socket?.on("cache:invalidate", async ({ key }: { key: string }) => {
        await cavity.delete(key);
      });

      socket?.on("connect", () => {
        logger.cavity("WS connected:", socket.id)
        subscriptions.forEach((key) => cavity.socket.subscribe(key));
      });

      socket?.on("disconnect", (reason) => {
        logger.cavityError("WS disconnected:", reason)
      });
    },

    subscribe(key: string) {
      if (!socket?.connected) return;
      if (subscriptions.has(key)) return;

      subscriptions.add(key);
      socket.emit("cache:subscribe", { key });
    },

    unsubscribe(key: string) {
      if (!socket?.connected) return;
      if (!subscriptions.has(key)) return;

      subscriptions.delete(key);
      socket.emit("cache:unsubscribe", { key });
    },

    invalidate(key: string) {
      if (!socket?.connected) return;
      socket.emit("cache:invalidate", { key });
    },
  }
};
