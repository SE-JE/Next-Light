"use client"

import { ReactNode, useEffect, useState } from "react";
import { faChevronDown, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn } from "@utils";



type CT = "container" | "head" | "active" | "base";

export interface AccordionProps {
  setActive   ?:  number | null;
  items        :  { head: ReactNode; content: ReactNode }[];
  horizontal  ?:  boolean;
  className   ?:  string;
};



export function AccordionComponent({
  items,
  setActive = null,
  horizontal = false,

  /** Use custom class with: "container::", "head::", "active::". */
  className = "",
}: AccordionProps) {
  const [isActive, setIsActive] = useState<number | null>(setActive);

  useEffect(() => {
    setIsActive(setActive);
  }, [setActive]);

  const styles = {
    container: cn(
      "bg-white border rounded-lg flex",
      horizontal ? "flex-row w-min border-r-0" : "flex-col border-b-0",
      pcn<CT>(className, "container"),
    ),
    head: cn(
      "flex justify-between items-center gap-4 font-semibold cursor-pointer",
      horizontal ? "flex-col px-2 py-4" : "py-2 px-4",
      pcn<CT>(className, "head"),
    ),
  };

  return (
    <div className={styles?.container}>
      {items.map(({ head, content }, key) => (
        <div
          key={key}
          className={cn(horizontal ? "border-r flex" : "border-b")}
        >
          <div
            className={styles?.head}
            onClick={() => setIsActive(isActive === key ? null : key)}
          >
            <div>{head}</div>
            <div
              className={cn(
                "w-min transition-transform",
                isActive !== key && "rotate-180",
              )}
            >
              <FontAwesomeIcon icon={horizontal ? faChevronLeft : faChevronDown} />
            </div>
          </div>
          <div
            className={cn(
              "transition-all overflow-hidden",
              horizontal ? isActive === key  ? "max-w-max pr-4 py-2" : "max-w-0 px-0"
                : isActive === key ? "max-h-max pb-4 px-4" : "max-h-0 pb-0 px-4",
              pcn<CT>(className, "base"),
              isActive === key && pcn<CT>(className, "active"),
            )}
          >{content}</div>
        </div>
      ))}
    </div>
  );
}
