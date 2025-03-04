import { cn } from "@/helpers";
import Link from "next/link";
import React, { ReactNode } from "react";

export function DashboardCardComponent({
  content,
  title,
  rightContent,
  path,
  className,
}: {
  content?: string | ReactNode;
  title?: string | ReactNode;
  rightContent?: string | ReactNode;
  path?: string;
  className?: string;
}) {
  return (
    <>
      <Link href={path || ""}>
        <div
          className={cn(
            `bg-white border py-4 px-6 rounded-[6px] flex justify-between gap-4 items-center`,
            className
          )}
        >
          <div>
            <div className="flex gap-4 items-center">{content}</div>
            {title}
          </div>
          <div>{rightContent}</div>
        </div>
      </Link>
    </>
  );
}
