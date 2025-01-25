import clsx from "clsx";
import Image from "next/image";
import React from "react";

export function ProfileCardComponent({
  image = "",
  name,
  short,
  description,
  footer,
  className,
}: {
  name: string;
  short?: string;
  image?: string;
  description?: string | React.ReactNode;
  footer?: string | React.ReactNode;
  className?: {
    container?: string;
    image?: string;
  };
}) {
  return (
    <>
      <div
        className={clsx(
          "relative block overflow-hidden rounded-lg bg-white p-4 sm:p-6",
          className?.container
        )}
      >
        <span className="absolute inset-x-0 bottom-0 h-1 bg-primary"></span>

        <div className="sm:flex sm:gap-4 sm:items-center">
          {image && (
            <div className="hidden sm:block sm:shrink-0">
              <Image
                src={image}
                alt={image}
                width={400}
                height={400}
                className={clsx(
                  "size-16 rounded-2xl object-cover shadow-sm",
                  className?.image
                )}
              />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold sm:text-xl">{name}</h3>

            <p className="mt-1 text-xs font-medium text-light-foreground">
              {short}
            </p>
          </div>
        </div>

        {description}

        {footer && <dl className="mt-4">{footer}</dl>}
      </div>
    </>
  );
}
