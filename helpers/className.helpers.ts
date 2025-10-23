import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ==============================>
// ## Merge class name
// ==============================>
export const cn  =  (...classes: ClassValue[]) => twMerge(clsx(classes));

// ==============================>
// ## Parse class name with custom prefix
// ==============================>
export const pcn = <prefixType>(className: string, prefix: prefixType, pseudoClass?:  string): string => {
  const classes  =  className.split(" ");
  
  const matchedClasses  =  classes.filter((cls) => {
    const [clsPrefix, ...rest]  =  cls.split("::");
    
    if (rest.length === 0 && (prefix === "input" || prefix === "base")) return true;

    if (rest.length > 0 && clsPrefix === prefix) {
      if (pseudoClass) {
        const [pseudo] = rest.join("::").split(":");
        return pseudo === pseudoClass;
      }

      return true;
    }

    return false;
  }).map((cls) => {
    const [clsPrefix, ...rest]  =  cls.split("::");
    
    if (rest.length > 0 && clsPrefix === prefix) {
      const classNameWithoutPrefix  =  rest.join("::");
      
      if (pseudoClass) {
        return classNameWithoutPrefix.split(":").slice(1).join(":");
      } else {
        if (/^(?!.*\b\w+:).*$/.test(classNameWithoutPrefix)) {
          return classNameWithoutPrefix;
        } else {
          return "";
        }
      }
    }

    if (rest.length === 0 && (prefix === "input" || prefix === "base")) return cls;
    
    return "";
  }).filter(Boolean);

  return matchedClasses.join(" ");
};
