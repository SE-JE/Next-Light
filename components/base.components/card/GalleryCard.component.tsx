import clsx from "clsx";
import Image from "next/image";
import React from "react";

export function GalleryCardComponent({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: {
    container?: string;
    image?: string;
    label?: string;
  };
}) {
  return (
    <>
      <div className={className?.container}>
        <Image
          src={src}
          alt={src}
          width={400}
          height={300}
          className={clsx(
            "w-full rounded-bl-3xl rounded-tr-3xl object-cover aspect-[4/3] shadow-sm",
            className?.image
          )}
        />

        <div
          className={clsx(
            "mt-1 text-center text-sm text-light-foreground",
            className?.label
          )}
        >
          {alt}
        </div>
      </div>
    </>
  );
}
