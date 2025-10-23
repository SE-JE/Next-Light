import { useEffect, useState } from "react";
import { validationLangs } from "./../langs";

export type ValidationRulesType = {
  required     ?:  boolean;
  min          ?:  number;
  max          ?:  number;
  uppercase    ?:  boolean;
  lowercase    ?:  boolean;
  numeric      ?:  boolean;
  email        ?:  boolean;
  url          ?:  boolean;
  mimeTypes    ?:  string[];
  maxFileSize  ?:  number;
};

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
    | (string | number)[];
  rules  ?:  ValidationRulesType;
};

export type ValidationHelperResults = {
  valid    :  boolean;
  message  :  string;
};



// =========================>
// ## validation function
// =========================>
export const validationHelper = ({value, rules}: ValidationHelperPropsType): ValidationHelperResults => {
  let errorMessage = "";

  // =========================>
  // ## Required field
  // =========================>
  if (rules?.required && !value) return { valid: false, message: validationLangs.required };

  if (value) {
    const valueStr = typeof value === "string" ? value : "";

    // =========================>
    // ## Max length field
    // =========================>
    if (rules?.max && valueStr.length > rules.max) {
      errorMessage = validationLangs.max.replace(/@max/g, rules.max.toString());
      return { valid: false, message: errorMessage };
    }

    // =========================>
    // ## Min length field
    // =========================>
    if (rules?.min && valueStr.length < rules.min) {
      errorMessage = validationLangs.min.replace(/@min/g, rules.min.toString());
      return { valid: false, message: errorMessage };
    }

    // =========================>
    // ## Min & Max length field
    // =========================>
    if (rules?.min && rules?.max && (valueStr.length < rules.min || valueStr.length > rules.max)) {
      errorMessage = validationLangs.min_max.replace(/@min/g, rules.min.toString()).replace(/@max/g, rules.max.toString());
      return { valid: false, message: errorMessage };
    }

    // =========================>
    // ## Uppercase field
    // =========================>
    if (rules?.uppercase && !/[A-Z]/.test(valueStr)) return { valid: false, message: validationLangs.uppercase };

    // =========================>
    // ## Lowercase field
    // =========================>
    if (rules?.lowercase && !/[a-z]/.test(valueStr)) return { valid: false, message: validationLangs.lowercase };

    // =========================>
    // ## Numeric field
    // =========================>
    if (rules?.numeric && !/[0-9]/.test(valueStr)) return { valid: false, message: validationLangs.numeric };

    // =========================>
    // ## Email field
    // =========================>
    if (rules?.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valueStr)) return { valid: false, message: validationLangs.email };

    // =========================>
    // ## Mime type field
    // =========================>
    if (rules?.mimeTypes && (value instanceof File || (Array.isArray(value) && value.every((v) => v instanceof File)))) {
      const files        =  Array.isArray(value) ? value : [value];
      const invalidFile  =  files.find((file) => !rules.mimeTypes?.includes(file.type));

      if (invalidFile) return { valid: false, message: validationLangs.invalid_file_type };
    }

    // =========================>
    // ## File size field
    // =========================>
    if (rules?.maxFileSize && (value instanceof File || (Array.isArray(value) && value.every((v) => v instanceof File)))) {
      const files          =  Array.isArray(value) ? value : [value];
      const oversizedFile  =  files.find((file) => file.size > (rules.maxFileSize || 0));

      if (oversizedFile) {
        errorMessage = validationLangs.max_file_size.replace(/@maxFileSize/g,(rules.maxFileSize / (1024 * 1024)).toFixed(2));
        return { valid: false, message: errorMessage };
      }
    }
  }

  return { valid: true, message: "" };
};



// =========================>
// ## validation hook function
// =========================>
export const useValidationHelper = ({ value, rules }: ValidationHelperPropsType, sleep = false): [string] => {
  const [message, setMessage]  =  useState<string>("");

  useEffect(() => {
    if (rules && !sleep) {
      const { valid, message } = validationHelper({ value, rules });
      setMessage(valid ? "" : message);
    }
  }, [value, rules, sleep]);

  return [message];
};
