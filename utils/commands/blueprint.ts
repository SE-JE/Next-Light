import fs from "fs";
import path from "path";
import { ValidationRules } from "../validation.util";
import { logger } from "./logger";
import { conversion } from "../conversion.util";



type SchemaMap = Record<string, string>

type ColumnItem = {
  selector  ?:  string
  label      :  string
  sortable  ?:  boolean
  item      ?:  string
}

type FormItem = {
  type          ?:  string
  col           ?:  number
  construction   :  {
    name         :  string
    label        :  string
    placeholder  :  string
    validations  :  ValidationRules[]
    serverOptionControl ?: {
      path : string
    }
    fields ?: FormItem[]
    wrap  ?: boolean
  }
}

type DetailItem = {
  label  :  string
  item   :  string
}

type ParsedSchema = {
  columns  :  ColumnItem[]
  forms    :  FormItem[]
  details  :  DetailItem[]
}

type BlueprintPage = {
  features  ?:  string
  path      ?:  string
  schema    ?:  Record<string, string>
}

type BlueprintStruct = {
  model    :  string
  controllers ?: string[]
  schema  ?:  SchemaMap
  pages   ?:  false | Record<string, BlueprintPage>
  [key: string]: any
}

type LoadedBlueprintFile = {
  file        :  string
  blueprints  :  BlueprintStruct[]
}



const renderJS = (value: unknown, indent = 0): string => {
  const pad = " ".repeat(indent)

  if (Array.isArray(value)) {
    if (!value.length) return "[]"

    if (value.every(v => typeof v === "string")) {
      return `[${value.map(v => JSON.stringify(v)).join(", ")}]`
    }

    return `[\n${value
      .map(v => pad + "  " + renderJS(v, indent + 2))
      .join(",\n")}\n${pad}]`
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    if (!entries.length) return "{}"

    return `{\n${entries
      .map(([k, v]) => `${pad}  ${k}: ${renderJS(v, indent + 2)}`)
      .join(",\n")}\n${pad}}`
  }

  if (typeof value === "string") return JSON.stringify(value)

  return String(value)
}

function extractValidationArray(def: string = ""): ValidationRules[] {
  const rules: ValidationRules[] = []

  if (def.includes("required")) rules.push("required")

  if (def.includes("email")) rules.push("email")

  if (def.includes("url")) rules.push("url")

  const min = def.match(/min,(\d+)/)
  if (min) rules.push(`min:${min[1]}`)

  const max = def.match(/max,(\d+)/)
  if (max) rules.push(`max:${max[1]}`)

  return rules
}

function extractFormType(rules: string[]): string | undefined {
  const rule = rules.find(r => r.startsWith("form:"))
  return rule ? rule.replace("form:", "") : undefined
}

function inferFormType(pageDef = "", modelDef = ""): string {
  const explicit = pageDef.split("|")
  if (explicit && explicit[0] && explicit[0] != "text") return explicit[0]

  if (modelDef.includes("type:integer") || modelDef.includes("type:float")) {
    return "number"
  }

  if (modelDef.includes("type:date")) return "date"
  if (modelDef.includes("type:datetime")) return "datetime"
  if (modelDef.includes("type:image")) return "image"

  return "default"
}

function parseFeatures(features?: string): { controlBar: string[]; action: string[] } {
  const controlBar: string[] = []
  const action: string[] = []

  if (!features) {
    return { controlBar: ["CREATE"], action: ["EDIT", "DELETE"] }
  }

  const list = features.split(" ")

  if (list.includes("create")) controlBar.push("CREATE")

  controlBar.push("SEARCH", "SORT", "SELECTABLE")

  if (list.includes("import")) controlBar.push("IMPORT")
  if (list.includes("export")) controlBar.push("EXPORT")
  if (list.includes("print")) controlBar.push("PRINT")

  if (list.includes("update") || list.includes("edit")) action.push("EDIT")
  if (list.includes("delete")) action.push("DELETE")
  if (list.includes("detail")) action.push("DETAIL")

  return { controlBar, action }
}

function parseModelSchema(schema: SchemaMap = {}): ParsedSchema {
  const columns: ColumnItem[] = []
  const forms: FormItem[] = []
  const details: DetailItem[] = []

  for (const [field, def] of Object.entries(schema)) {
    const label = conversion.strPascal(field, " ")

    if (def.includes("selectable")) {
      columns.push({ selector: field, label })
      details.push({ label, item: field })
    }

    if (def.includes("fillable")) {
      const fieldType = inferFormType("", def);
      forms.push({
        ...(fieldType != "default" ? { type: fieldType } : {}),
        construction: {
          name: field,
          label,
          placeholder: "Masukkan " + label.toLowerCase(),
          validations: extractValidationArray(def)
        }
      })
    }
  }

  return { columns, forms, details }
}

function resolvePath(page: BlueprintPage, controllers: string[] | boolean | undefined, model: string): string {
  if (page.path) return page.path

  if (Array.isArray(controllers)) {
    const match = controllers
    if (match) return "/" + match[1]
  }

  return "/" + model.split("/").pop()
}

function parsePageSchema(pageSchema: Record<string, string>, modelSchema: SchemaMap = {}): ParsedSchema {
  const columns: ColumnItem[] = []
  const forms: FormItem[] = []
  const details: DetailItem[] = []

  for (const [field, def] of Object.entries(pageSchema)) {
    const rules = def.replace(/\|/g, " ").split(" ").filter(Boolean)
    
    const defaultLabel = conversion.strPascal(field, " ")
    
    const colLabelRule = rules.find(r => r.includes("column:label,"))
    const colLabel = conversion.strPascal(colLabelRule ? colLabelRule.split(",")[1] : defaultLabel, " ")

    const formLabelRule = rules.find(r => r.includes("form:label,"))
    const formLabel = conversion.strPascal(formLabelRule ? formLabelRule.split(",")[1] : (colLabelRule ? colLabel : defaultLabel), " ")

    const detailLabel = colLabelRule ? colLabel : (formLabelRule ? formLabel : defaultLabel) 

    const hasColumn = rules.some(r => r.includes("column:"))
    const hasForm = rules.some(r => r.includes("form:")) || rules.every(r => !r.includes("column:"))
    
    const hasDetail = rules.includes("detail")

    if (hasColumn) {
      columns.push({
        selector: field,
        label: colLabel,
        ...(rules.includes("column:sortable") || rules.includes("sortable") ? { sortable: true } : {})
      })
      if (!hasDetail) details.push({ label: detailLabel, item: field })
    }

    if (hasForm) {
      const typeRules = rules.filter(r => !r.startsWith("form:label,"))
      const typeRule = extractFormType(typeRules)
      let fieldType = inferFormType(typeRule, modelSchema[field] || "");

      let selectPath = ""
      const selectRule = rules.find(r => r.startsWith("select,") || r.startsWith("form:select,"))
      if (selectRule) {
        fieldType = "select"
        selectPath = selectRule.split(",")[1]
      }
      
      if (typeRule === "check") fieldType = "boolean" 
      if (typeRule === "currency") fieldType = "currency"
      if (typeRule === "image") fieldType = "image"
      if (typeRule === "date") fieldType = "date"
      if (typeRule === "time") fieldType = "time"
      
      let col: number | undefined
      const colRule = rules.find(r => /col,(\d+)/.test(r))
      
      if (colRule) {
        const n = Number(colRule.split(',').pop())
        if (n >= 1 && n <= 12) col = n
      }

      forms.push({
        ...(fieldType != "default" && fieldType != "text" ? { type: fieldType } : {}),
        ...(col ? { col } : {}),
        construction: {
          name: field,
          label: formLabel,
          placeholder: "Masukkan " + formLabel.toLowerCase(),
          validations: extractValidationArray(modelSchema[field] || ""),
          ...(selectPath ? { serverOptionControl: { path: selectPath } } : {}),
          ...(rules.includes("wrap") ? { wrap: true } : {})
        }
      })
    }

    if (hasDetail) details.push({ label: detailLabel, item: field })
  }

  const formMap = new Map<string, FormItem>()
  forms.forEach(f => formMap.set(f.construction.name, f))

  const nestedForms: FormItem[] = []

  forms.forEach(f => {
    const name = f.construction.name
    if (name.includes(".")) {
      const parts = name.split(".")
      const selfName = parts.pop() as string
      const parentName = parts.join(".")
      const parent = formMap.get(parentName)

      if (parent) {
        if (!parent.type) parent.type = "cluster"
        if (!parent.construction.fields) parent.construction.fields = []
        
        f.construction.name = selfName
        
        parent.construction.fields.push(f)
      } else {
        nestedForms.push(f)
      }
    } else {
      nestedForms.push(f)
    }
  })
  
  return { columns, forms: nestedForms, details }
}



function loadBlueprintFiles(dir: string = "blueprints"): LoadedBlueprintFile[] {
  const basePath = path.join(process.cwd(), dir)

  if (!fs.existsSync(basePath)) {
    throw new Error("Blueprint folder not found")
  }

  return fs.readdirSync(basePath)
    .filter(f => f.endsWith(".blueprint.json"))
    .map(file => {
      const fullPath = path.join(basePath, file)
      const content = JSON.parse(fs.readFileSync(fullPath, "utf-8"))

      if (!Array.isArray(content)) {
        throw new Error(`${file} must export array of blueprints`)
      }

      return {
        file: file.replace(".blueprint.json", ""),
        blueprints: content as BlueprintStruct[],
      }
    })
}

const blueprintMarker = `// ============================================
// ## file THIS FILE IS AUTO-GENERATED BY BLUEPRINT
// ?? Blueprint : {{ blueprint }}
// !! If this comment is removed, blueprint engine WILL NOT override this file.
// ============================================


`


// ===============================
// ## Main generator
// ===============================

export async function blueprint(options?: { only?: string[] }): Promise<void> {
  const stub = fs.readFileSync(path.join(process.cwd(), "/utils/commands/stubs/table-blueprint.stub"), "utf-8")

  const loaded = loadBlueprintFiles()

  for (const file of loaded) {
    for (const bp of file.blueprints) {

    const pagesToGenerate: Record<string, BlueprintPage> = { ...(bp.pages || {}) }
    
    for (const [key, val] of Object.entries(bp)) {
      if (typeof val === "object" && val["schema"]) {
        pagesToGenerate[key] = val as BlueprintPage
      }
    }

    for (const [key, page] of Object.entries(pagesToGenerate)) {

      const route = key;
      const name = conversion.strPascal(route.split("/").pop() as string)

      if (options?.only && !options.only.includes(name)) continue

      const outDir = path.join(process.cwd(), "app", route)
      fs.mkdirSync(outDir, { recursive: true })

      const filePath = path.join(outDir, "page.tsx");

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8")

        if (!content.includes("AUTO-GENERATED BY BLUEPRINT")) {
          logger.info(`Skip overridden file: ${filePath}`)
          continue
        }
      }

      const schema = bp.schema ?? {}

      const parsed: ParsedSchema = page?.schema ? parsePageSchema(page.schema, schema) : parseModelSchema(schema)

      const { controlBar, action } = parseFeatures(page?.features)

      const fetchPath = resolvePath(page, bp.controllers, bp.model)

      let properties = `
        fetchControl={{
          path: "${fetchPath}" 
        }}
          columnControl={${renderJS(parsed.columns, 8)}}
          formControl={{ 
            fields: ${renderJS(parsed.forms, 10)} 
          }}
        `
        if (parsed.details) {
          properties += `  detailControl={${renderJS(parsed.details, 8)}}\n`
        }
  
        if (controlBar.length) {
          properties += `        controlBar={${JSON.stringify(controlBar)}}\n`
        }
  
        if (action.length) {
          properties += `        actionControl={${JSON.stringify(action)}}\n`
        }
  
        const content = stub
          .replace(/{{ marker }}/g, blueprintMarker.replace(/{{ blueprint }}/g, file.file + ".blueprint.json"))
          .replace(/{{ name }}/g, name)
          .replace(/{{ title }}/g, name)
          .replace(/{{ properties }}/g, properties)
  
        fs.writeFileSync(path.join(outDir, "page.tsx"), content)
        logger.info(`Generated: ${filePath}`)
      }
    }
  }
}
