"use client"

import { useEffect, useState } from "react"
import validator from "validator"
import { validationLangs } from "../langs"

export type ValidationHelperPropsType = {
  value:
    | string
    | string[]
    | number
    | number[]
    | Date
    | Date[]
    | File
    | File[]
    | null
    | object
    | boolean
    | (string | number)[]
  rules?: string 
}

export type ValidationHelperResults = {
  valid: boolean
  message: string
}

export const validation = {
  // =========================>
  // ## Check value match of rules
  // =========================>
  check: ({
    value,
    rules,
  }: ValidationHelperPropsType): ValidationHelperResults => {
    const parsedRules = validation.parseRules(rules)
    let errorMessage = ""

    for (const rule of parsedRules) {
      const { name, param } = rule
      const strValue = String(value ?? "").trim()

      switch (name) {
        // === BASIC ===
        case "required":
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return { valid: false, message: validationLangs.required }
          }
          break

        case "numeric":
          if (!validator.isNumeric(strValue)) {
            return { valid: false, message: validationLangs.numeric || "Harus berupa angka" }
          }
          break

        case "email":
          if (!validator.isEmail(strValue)) {
            return { valid: false, message: validationLangs.email }
          }
          break

        case "url":
          if (!validator.isURL(strValue)) {
            return { valid: false, message: validationLangs.url || "Harus berupa URL yang valid" }
          }
          break

        // === LENGTH ===
        case "min":
          if (!validator.isLength(strValue, { min: parseInt(param || "0") })) {
            errorMessage = validationLangs.min.replace(/@min/g, param || "0")
            return { valid: false, message: errorMessage }
          }
          break

        case "max":
          if (!validator.isLength(strValue, { max: parseInt(param || "0") })) {
            errorMessage = validationLangs.max.replace(/@max/g, param || "0")
            return { valid: false, message: errorMessage }
          }
          break

        case "between": {
          const [minVal, maxVal] = (param || "0,0").split(",").map(Number)
          if (!validator.isLength(strValue, { min: minVal, max: maxVal })) {
            errorMessage = validationLangs.min_max.replace(/@min/g, String(minVal)).replace(/@max/g, String(maxVal))
            return { valid: false, message: errorMessage }
          }
          break
        }

        // === IN/NOT IN ===
        case "in": {
          const allowed = (param || "").split(",")
          if (!allowed.includes(strValue)) {
            return { valid: false, message: `${validationLangs.in || "Harus salah satu dari"} ${allowed.join(", ")}` }
          }
          break
        }

        case "not_in": {
          const notAllowed = (param || "").split(",")
          if (notAllowed.includes(strValue)) {
            return { valid: false, message: `${validationLangs.not_in || "Tidak boleh salah satu dari"} ${notAllowed.join(", ")}` }
          }
          break
        }

        // === REGEX ===
        case "regex":
          try {
            const pattern = new RegExp(param || "")
            if (!pattern.test(strValue)) {
              return { valid: false, message: validationLangs.regex || "Format tidak sesuai" }
            }
          } catch {
            return { valid: false, message: "Regex rule tidak valid" }
          }
          break
      }
    }

    return { valid: true, message: "" }
  },



  // =========================>
  // ## Parse rules
  // =========================>
  parseRules: (ruleString?: string): { name: string; param?: string }[] => {
    if (!ruleString) return []
    
    return ruleString.split("|").map((r) => {
      const [name, param] = r.split(":")
      return { name: name.trim(), param: param?.trim() }
    })
  },



  // =========================>
  // ## Check has rules of validations
  // =========================>
  hasRules: (rules?: string, ruleName?: string | string[]): boolean => {
    if (!rules || !ruleName) return false

    const parsed = rules.split("|").map((r) => r.split(":")[0].trim())

    if (Array.isArray(ruleName)) return ruleName.every((name) => parsed.includes(name))

    return parsed.includes(ruleName)
  },



  // =========================>
  // ## get has rules params
  // =========================>
  getRules(rules: string, ruleName: string): string | undefined {
    const found = rules.split("|").find(r => r.startsWith(ruleName + ":"))
    return found ? found.split(":")[1] : undefined
  }
}



// =========================>
// ## Check validation Hook
// =========================>
export const useValidation = (value: any = "", rules: string = "", includes: string = "", sleep: boolean = false): [string, (message: string) => void] => {
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (rules && !sleep) {
      const { valid, message } = validation.check({ value, rules })
      setMessage(valid ? "" : message)
    } else {
      setMessage("")
    }
  }, [value, rules, sleep])


  useEffect(() => {
    if (includes) setMessage(includes);
  }, [includes])

  return [message, setMessage]
}

