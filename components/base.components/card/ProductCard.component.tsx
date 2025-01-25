import clsx from "clsx";
import Image from "next/image";
import React from "react";

export function ProductCardComponent({
  image = "",
  name,
  price,
  description,
  className,
}: {
  name: string;
  price?: string;
  image?: string;
  description?: string | React.ReactNode;
  className?: {
    container?: string;
    image?: string;
  };
}) {
  return (
    <>
      <div
        className={clsx(
          "rounded-lg p-2 shadow-sm bg-white",
          className?.container
        )}
      >
        <Image
          src={image}
          alt={image}
          width={400}
          height={300}
          className={clsx(
            "h-56 w-full rounded-md object-cover",
            className?.image
          )}
        />

        <div className="p-2">
          <dl>
            <div>
              <dt className="sr-only">Name</dt>
              <dd className="text-sm">{name}</dd>
            </div>
            <div>
              <dt className="sr-only">Price</dt>
              <dd className="font-semibold">{price}</dd>
            </div>
          </dl>

          {description && <div>{description}</div>}
        </div>
      </div>
    </>
  );
}
