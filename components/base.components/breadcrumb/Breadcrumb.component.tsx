import React, { ReactNode } from "react";
import Link from "next/link";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, pcn } from "@/helpers";

type CT = "container" | "active" | "base";

export type BreadcrumbItemPropsType = {
  path: string;
  label: string;
  className?: string;
};

export function BreadcrumbComponent({
  items,
  className = "",
  square = false,
  separatorContent,
}: {
  items: BreadcrumbItemPropsType[];
  square?: boolean;
  separatorContent?: string | ReactNode;

  /** Use custom class with: "container::", "active::". */
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "w-full overflow-x-auto overflow-y-hidden whitespace-nowrap",
        pcn<CT>(className, "container")
      )}
    >
      <ol className="flex">
        {items.map((item, index) => {
          const isActive = index === items.length - 1;

          return (
            <React.Fragment key={item.path}>
              <li>
                <Link
                  href={item.path}
                  className={cn(
                    "capitalize",
                    pcn<CT>(className, "base"),
                    square && "py-2 px-4 rounded-[6px] bg-light-foreground/10",
                    isActive && "text-primary",
                    isActive && square && "text-primary bg-primary/10",
                    isActive && pcn<CT>(className, "active")
                  )}
                >
                  {item.label}
                </Link>
              </li>
              {!isActive && (
                <li className="mx-2">
                  {separatorContent || (
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-light-foreground"
                    />
                  )}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
