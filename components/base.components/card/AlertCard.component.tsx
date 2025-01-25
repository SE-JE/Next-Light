import clsx from "clsx";
import React, { ReactNode } from "react";

export function AlertCardComponent({
  title,
  leftContent,
  badge,
  content,
  footer,
  className,
}: {
  title?: string | ReactNode;
  leftContent?: string | ReactNode;
  badge?: string | ReactNode;
  content?: string | ReactNode;
  footer?: string | ReactNode;
  className?: {
    container?: string;
    title?: string;
    badge?: string;
  };
}) {
  return (
    <>
      <section
        className={clsx(
          "rounded-xl bg-white p-4 shadow-sm sm:p-6",
          className?.container
        )}
      >
        <div className="flex items-start sm:gap-8">
          {leftContent}

          <div>
            <strong
              className={clsx(
                "rounded-lg border border-primary text-primary bg-primary/20 px-3 py-1.5 text-xs font-bold",
                className?.badge
              )}
            >
              {badge}
            </strong>

            <h3
              className={clsx(
                "mt-4 text-lg font-medium sm:text-xl",
                className?.title
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
