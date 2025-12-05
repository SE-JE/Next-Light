"use client"

import { ReactNode } from "react";
import { cn, pcn } from "@utils";



type CT = "badge" | "title" | "base";

export interface AlertCardProps {
  title        ?:  string | ReactNode;
  leftContent  ?:  string | ReactNode;
  badge        ?:  string | ReactNode;
  content      ?:  string | ReactNode;
  footer       ?:  string | ReactNode;

  /** Use custom class with: "badge::", "title::". */
  className  ?:  string;
}



export function AlertCardComponent({
  title,
  leftContent,
  badge,
  content,
  footer,
  className = "",
}: AlertCardProps) {
  return (
    <>
      <section
        className={cn(
          "rounded-[6px] bg-white p-4 border sm:p-6",
          pcn<CT>(className, "base"),
        )}
      >
        <div className="flex items-start sm:gap-8">
          {leftContent}

          <div>
            <strong
              className={cn(
                "rounded-[4px] border text-primary bg-primary/20 px-3 py-1.5 text-xs font-bold",
                pcn<CT>(className, "badge"),
              )}
            >
              {badge}
            </strong>

            <h3
              className={cn(
                "mt-4 text-lg font-medium sm:text-xl",
                pcn<CT>(className, "title"),
              )}
            >
              {title}
            </h3>

            {content}

            {footer && <div className="pt-4">{footer}</div>}
          </div>
        </div>
      </section>
    </>
  );
}
