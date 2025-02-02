import { useEffect, useState } from "react";
import { validationLangs } from "./../langs";

export type ValidationRules = {
  required?: boolean;
  min?: number;
  max?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numeric?: boolean;
  email?: boolean;
  url?: boolean;
  mimeTypes?: string[]; // New validation rule for file MIME types
  maxFileSize?: number; // New validation rule for max file size in bytes
};

export type ValidationHelperProps = {
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
  rules?: ValidationRules;
};

export type ValidationHelperResults = {
  valid: boolean;
  message: string;
};

// =========================>
// ## validation function
// =========================>
export const validationHelper = ({
  value,
  rules,
}: ValidationHelperProps): ValidationHelperResults => {
  let errorMessage = "";

  // Check required
  if (rules?.required && !value) {
    errorMessage = validationLangs.required;
    return { valid: false, message: errorMessage };
  }

  if (value) {
    const valueStr = typeof value === "string" ? value : "";

    // Check max length
    if (rules?.max && valueStr.length > rules.max) {
      errorMessage = validationLangs.max.replace(/@max/g, rules.max.toString());
      return { valid: false, message: errorMessage };
    }

    // Check min length
    if (rules?.min && valueStr.length < rules.min) {
      errorMessage = validationLangs.min.replace(/@min/g, rules.min.toString());
      return { valid: false, message: errorMessage };
    }

    // Check min & max length
    if (
      rules?.min &&
      rules?.max &&
      (valueStr.length < rules.min || valueStr.length > rules.max)
    ) {
      errorMessage = validationLangs.min_max
        .replace(/@min/g, rules.min.toString())
        .replace(/@max/g, rules.max.toString());
      return { valid: false, message: errorMessage };
    }

    // Check uppercase
    if (rules?.uppercase && !/[A-Z]/.test(valueStr)) {
      errorMessage = validationLangs.uppercase;
      return { valid: false, message: errorMessage };
    }

    // Check lowercase
    if (rules?.lowercase && !/[a-z]/.test(valueStr)) {
      errorMessage = validationLangs.lowercase;
      return { valid: false, message: errorMessage };
    }

    // Check numeric
    if (rules?.numeric && !/[0-9]/.test(valueStr)) {
      errorMessage = validationLangs.numeric;
      return { valid: false, message: errorMessage };
    }

    // Check valid email
    if (
      rules?.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(valueStr)
    ) {
      errorMessage = validationLangs.email;
      return { valid: false, message: errorMessage };
    }

    // Check MIME types for files
    if (
      rules?.mimeTypes &&
      (value instanceof File ||
        (Array.isArray(value) && value.every((v) => v instanceof File)))
    ) {
      const files = Array.isArray(value) ? value : [value];
      const invalidFile = files.find(
        (file) => !rules.mimeTypes?.includes(file.type)
      );

      if (invalidFile) {
        errorMessage = validationLangs.invalid_file_type;
        return { valid: false, message: errorMessage };
      }
    }

    // Check max file size for files
    if (
      rules?.maxFileSize &&
      (value instanceof File ||
        (Array.isArray(value) && value.every((v) => v instanceof File)))
    ) {
      const files = Array.isArray(value) ? value : [value];
      const oversizedFile = files.find(
        (file) => file.size > (rules.maxFileSize || 0)
      );

      if (oversizedFile) {
        errorMessage = validationLangs.max_file_size.replace(
          /@maxFileSize/g,
          (rules.maxFileSize / (1024 * 1024)).toFixed(2) // Convert to MB
        );
        return { valid: false, message: errorMessage };
      }
    }
  }

  return { valid: true, message: "" };
};

// =========================>
// ## validation hook function
// =========================>
export const useValidationHelper = (
  { value, rules }: ValidationHelperProps,
  sleep = false
): [string] => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (rules && !sleep) {
      const { valid, message } = validationHelper({ value, rules });
      setMessage(valid ? "" : message);
    }
  }, [value, rules, sleep]);

  return [message];
};
