import clsx from "clsx";
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
        className={clsx("px-4 py-2.5 rounded-xl shadow-sm bg-white", className)}
      >
        {children}
      </div>
    </>
  );
}
