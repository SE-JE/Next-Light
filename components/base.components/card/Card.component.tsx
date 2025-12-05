"use client"

import { cn } from "@utils";



export interface CardProps {
  children    :  React.ReactNode;
  className  ?:  string;
}



export function CardComponent({
  children,
  className,
}: CardProps) {
  return (
    <>
      <div className={cn("px-4 py-2.5 rounded-[6px] border bg-white", className)}>
        {children}
      </div>
    </>
  );
}
