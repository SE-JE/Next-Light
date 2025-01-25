import React, { ReactNode } from "react";
import Link from "next/link";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export type BreadcrumbItemProps = {
  path: string;
  label: string;
  className?: string;
};

export function BreadcrumbComponent({
  items,
  className,
  square = false,
  separatorContent,
}: {
  items: BreadcrumbItemProps[];
  className?: string;
  square?: boolean;
  separatorContent?: string | ReactNode;
}) {
  return (
    <nav className={clsx("w-full overflow-auto whitespace-nowrap", className)}>
      <ol className="flex">
        {items.map((item, index) => {
          const isActive = index === items.length - 1;

          return (
            <React.Fragment key={item.path}>
              <li>
                <Link
                  href={item.path}
                  className={clsx(
                    "capitalize",
                    isActive ? "text-primary" : "",
                    square &&
                      `py-2 px-4 rounded-[20px] ${
                        isActive
                          ? "text-primary bg-primary/30"
                          : "bg-light-foreground/30"
                      }`,
                    item.className
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
