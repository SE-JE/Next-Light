import {
  faChevronDown,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";

export type AccordionProps = {
  setActive?: number | null;
  items: { head: ReactNode; content: ReactNode }[];
  horizontal?: boolean;
  className?: {
    container?: string;
    head?: string;
    content?: string;
  };
};

export function AccordionComponent({
  items,
  setActive = null,
  horizontal = false,
  className = {},
}: AccordionProps) {
  const [isActive, setIsActive] = useState<number | null>(setActive);

  useEffect(() => {
    setIsActive(setActive);
  }, [setActive]);

  return (
    <div
      className={clsx(
        "bg-white border rounded-lg flex",
        horizontal ? "flex-row w-min" : "flex-col",
        className.container
      )}
    >
      {items.map(({ head, content }, key) => (
        <div
          key={key}
          className={clsx(horizontal ? "border-r flex" : "border-b")}
        >
          <div
            className={clsx(
              "flex justify-between items-center gap-4 font-semibold cursor-pointer",
              horizontal ? "flex-col px-2 py-4" : "py-2 px-4",
              className.head
            )}
            onClick={() => setIsActive(isActive === key ? null : key)}
          >
            <div>{head}</div>
            <div
              className={clsx(
                "w-min transition-transform",
                isActive !== key && "rotate-180"
              )}
            >
              <FontAwesomeIcon
                icon={horizontal ? faChevronLeft : faChevronDown}
              />
            </div>
          </div>
          <div
            className={clsx(
              "transition-all overflow-hidden",
              horizontal
                ? isActive === key
                  ? "max-w-max pr-4 py-2"
                  : "max-w-0 px-0"
                : isActive === key
                ? "max-h-max pb-4 px-4"
                : "max-h-0 pb-0 px-4",
              className.content
            )}
          >
            {content}
          </div>
        </div>
      ))}
    </div>
  );
}
