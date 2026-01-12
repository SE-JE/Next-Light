import { DBSchema } from "@/utils/idb.util"

const name  =  String(process.env.NEXT_PUBLIC_APP_NAME || "").toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "") + ".idb-app";

export const AppSchema: DBSchema = {
  name: name,
  version: 1,
  stores: {}
}