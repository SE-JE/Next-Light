import { cn } from "@/helpers";
import React from "react";

export function CardComponent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={cn("px-4 py-2.5 rounded-[6px] border bg-white", className)}
      >
        {children}
      </div>
    </>
  );
}
