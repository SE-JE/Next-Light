"use client"

import { useEffect } from "react"
import { idb } from "@utils"
import { AppSchema } from "@schema"


export function IDBProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => idb.setDefaultSchema(AppSchema), [])

  return <>{children}</>
}
