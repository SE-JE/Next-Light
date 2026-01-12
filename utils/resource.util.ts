"use client"

import { useEffect, useState } from "react"
import { ApiType } from "@utils"
import { useGetApi } from "@utils"
import { idb } from "@utils"

export type ResourceParams = {
  page      ?:  number
  paginate  ?:  number
  search    ?:  string
  sort      ?:  string[]
  expand    ?:  string[]
  filter    ?:  any[]
}

export type UseResourceApi = ApiType & {
  method?: "GET"
}

export type UseResourceIdb = {
  store: string
  schema?: any
}

export type UseResourceProps =
  | ({ path?: string; url?: string } & UseResourceApi)
  | ({ idb: UseResourceIdb })

export function useResource(
  props: UseResourceProps & { params?: ResourceParams }
) {
  const isApi = "path" in props || "url" in props

  const apiResult = useGetApi(isApi ? (props as UseResourceApi & { params?: ResourceParams }) : ({} as any), !isApi)

  // =====================
  // IDB MODE
  // =====================
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{data: any[], total_row: number} | null>(null)

  const idbParams = props.params || {}

  const fetchIdb = async () => {
    if (!("idb" in props)) return

    setLoading(true)
    try {
      const idbClient = props.idb.schema
        ? idb.useSchema(props.idb.schema)
        : idb
      
      let q = await idbClient.query<any>(props.idb.store)

      if (idbParams.search) {
        const keyword = idbParams.search.toLowerCase()
        q = q.where((row) =>
          Object.values(row).some((v) =>
            String(v).toLowerCase().includes(keyword)
          )
        )
      }

      if (Array.isArray(idbParams.filter)) {
        for (const f of idbParams.filter) {
          if (f?.field && f?.value !== undefined) {
            q = q.where((row) => row[f.field] === f.value)
          }
        }
      }

      if (Array.isArray(idbParams.sort) && idbParams.sort.length) {
        q = q.usingIndex(idbParams.sort[0]?.split(" ")?.at(0) || "created_at").order(idbParams.sort[0]?.split(" ")?.at(1) == "asc" ? "asc" : "desc")
      }

      if (idbParams.paginate) {
        q = q.paginate(idbParams.page || 0,idbParams.paginate)
      }

      const [rows, total] = await Promise.all([
        q.get(),
        q.count(),
      ])
      // const rows = await q.get()
      setData({ data: rows, total_row: total })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isApi && "idb" in props) fetchIdb()
  }, [
    isApi,
    idbParams.search,
    JSON.stringify(idbParams.filter),
    JSON.stringify(idbParams.sort),
    idbParams.paginate,
    idbParams.page,
  ])

  // =====================
  // Unified return
  // =====================
  if (isApi) {
    return {
      loading: apiResult.loading,
      data: apiResult.data,
      reset: apiResult.reset,
    }
  }
  
  return {
    loading,
    data: data,
    reset: fetchIdb,
  }
}
