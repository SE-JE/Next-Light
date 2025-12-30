export type IndexDef = {
  name    ?:  string
  fields   :  string | string[]
  unique  ?:  boolean
}

export type StoreDef = {
  key             :  string
  autoIncrement  ?:  boolean
  fields          :  Record<string, FieldType>
  indexes        ?:  IndexDef[]
}

export type DBSchema = {
  name     :  string
  version  :  number
  stores   :  Record<string, StoreDef>
}

export type JSONExport = {
  app             :  string
  schema_version  :  number
  exported_at     :  string
  stores          :  Record<string, any[]>
}

type FieldType     =  'string' | 'number' | 'boolean' | 'date' | 'json'
type WhereFn<T>    =  (row: T) => boolean
type UpsertPolicy  =  'replace' | 'merge' | 'keep-local'


const exportName  =  "DB -" + String(process.env.NEXT_PUBLIC_APP_NAME || "");



export const  idb = {
  open: (schema: DBSchema): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(schema.name, schema.version)

      req.onupgradeneeded = () => {
        const db = req.result

        for (const [storeName, def] of Object.entries(schema.stores)) {
          let store: IDBObjectStore

          if (!db.objectStoreNames.contains(storeName)) {
            store = db.createObjectStore(storeName, {
              keyPath: def.key,
              autoIncrement: def.autoIncrement,
            })
          } else {
            store = req.transaction!.objectStore(storeName)
          }

          def.indexes?.forEach((idx) => {
            const name = idx.name ?? (Array.isArray(idx.fields) ? idx.fields.join('_') : idx.fields)

            if (!store.indexNames.contains(name)) store.createIndex(name, idx.fields, { unique: idx.unique })
          })
        }
      }

      req.onsuccess  =  () => resolve(req.result)
      req.onerror    =  () => reject(req.error)
    })
  },

  query: <T = any>(db: IDBDatabase, store: string) => new IDBQuery<T>(db, store),

  put: <T>(db: IDBDatabase, store: string, row: T) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite')
      tx.objectStore(store).put(row)
  
      tx.oncomplete  =  () => resolve()
      tx.onerror     =  () => reject(tx.error)
    })
  },

  upsert: (db: IDBDatabase, storeName: string, rows: any[], keyPath: string, policy: UpsertPolicy) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      for (const row of rows) {
        const key = row[keyPath]

        if (policy === 'replace') {
          store.put(row)
          continue
        }

        const req = store.get(key)
        req.onsuccess = () => {
          const existing = req.result
          if (!existing) return store.put(row)
          if (policy === 'keep-local') return
          store.put({ ...existing, ...row })
        }
      }

      tx.oncomplete  =  () => resolve()
      tx.onerror     =  () => reject(tx.error)
    })
  },

  export: async (db: IDBDatabase, schema: DBSchema, type: "json" | "excel" = "json", filename ?: string) => {
    if (type == "excel") {
      const ExcelJS   =  (await import('exceljs')).default
      const workbook  =  new ExcelJS.Workbook()

      for (const [storeName, def] of Object.entries(schema.stores)) {
        const rows = await new Promise<any[]>((resolve, reject) => {
          const tx             =  db.transaction(storeName, 'readonly')
          const store          =  tx.objectStore(storeName)
          const req            =  store.getAll()

          req.onsuccess        =  () => resolve(req.result)
          req.onerror          =  () => reject(req.error)
        })

        if (!rows.length) continue

        const sheet          =  workbook.addWorksheet(storeName)
        const columns        =  Object.keys(def.fields)
        sheet.columns        =  columns.map(key => ({ header: key, key, width: 20 }))

        rows.forEach(row => sheet.addRow(row))
        sheet.getRow(1).font = { bold: true }
      }

      const buffer  =  await workbook.xlsx.writeBuffer()
      const blob    =  new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const url         =  URL.createObjectURL(blob)
      const a           =  document.createElement('a')
      a.href            =  url
      a.download        =  `${schema.name}-backup.xlsx`
      a.click()
      URL.revokeObjectURL(url)

    } else {

      const stores: Record<string, any[]> = {}
      for (const storeName of Object.keys(schema.stores)) {
        stores[storeName] = await new Promise<any[]>((resolve, reject) => {
          const tx             =  db.transaction(storeName, 'readonly')
          const store          =  tx.objectStore(storeName)
          const req            =  store.getAll()

          req.onsuccess        =  () => resolve(req.result)
          req.onerror          =  () => reject(req.error)
        })
      }

      const data = {
        app             :  schema.name,
        schema_version  :  schema.version,
        exported_at     :  new Date().toISOString(),
        stores          :  stores,
      }
      
      const blob        =  new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url         =  URL.createObjectURL(blob)
      const a           =  document.createElement('a')

      a.href      =  url
      a.download  =  (filename || exportName) + ".json"
      a.click()
      URL.revokeObjectURL(url)
    }
  },

  import: async (db: IDBDatabase, schema: DBSchema, data: JSONExport, policy: UpsertPolicy = 'merge') => {
    if (data.schema_version > schema.version) throw new Error('Incompatible schema version');

    for (const [storeName, rows] of Object.entries(data.stores)) {
      const def = schema.stores[storeName]
      if (!def) continue

      await new Promise<void>((resolve, reject) => {
        const tx     =  db.transaction(storeName, 'readwrite')
        const store  =  tx.objectStore(storeName)

        for (const row of rows) {
          const key = row[def.key]

          if (policy === 'replace') {
            store.put(row)
            continue
          }

          const req = store.get(key)

          req.onsuccess = () => {
            const existing = req.result
            if (!existing) return store.put(row)
            if (policy === 'keep-local') return
            store.put({ ...existing, ...row })
          }
        }

        tx.oncomplete  =  () => resolve()
        tx.onerror     =  () => reject(tx.error)
      })
    }
  }
}



class IDBQuery<T = any> {
  private indexName?: string
  private range?: IDBKeyRange
  private filters: WhereFn<T>[] = []
  private limitCount?: number

  constructor(
    private db: IDBDatabase,
    private storeName: string
  ) {}

  usingIndex(name: string) {
    this.indexName = name
    return this
  }

  equals(value: IDBValidKey) {
    this.range = IDBKeyRange.only(value)
    return this
  }

  between(from: IDBValidKey, to: IDBValidKey) {
    this.range = IDBKeyRange.bound(from, to)
    return this
  }

  where(fn: WhereFn<T>) {
    this.filters.push(fn)
    return this
  }

  limit(n: number) {
    this.limitCount = n
    return this
  }

  async get(): Promise<T[]> {
    const tx = this.db.transaction(this.storeName, 'readonly')
    const store = tx.objectStore(this.storeName)
    const source = this.indexName ? store.index(this.indexName) : store

    return new Promise((resolve, reject) => {
      const result: T[] = []
      const req = source.openCursor(this.range)

      req.onsuccess = () => {
        const cursor = req.result
        if (!cursor) return resolve(result)

        const value = cursor.value as T
        if (this.filters.every(f => f(value))) {
          result.push(value)
          if (this.limitCount && result.length >= this.limitCount) {
            return resolve(result)
          }
        }
        cursor.continue()
      }

      req.onerror = () => reject(req.error)
    })
  }
}
