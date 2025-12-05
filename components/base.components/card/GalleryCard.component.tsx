"use client"

import Image from "next/image";
import { cn, pcn } from "@utils";



type CT = "label" | "image" | "base";

export interface GalleryCardProps {
  src   :  string;
  alt  ?:  string;

  /** Use custom class with: "label::", "image::". */
  className?: string;
}



export function GalleryCardComponent({
  src,
  alt = "",
  className = "",
} : GalleryCardProps) {
  return (
    <>
      <div className={pcn<CT>(className, "base")}>
        <Image
          src={src}
          alt={src}
          width={400}
          height={300}
          className={cn(
            "w-full rounded-bl-4xl rounded-tr-3xl object-cover aspect-[4/3]",
            pcn<CT>(className, "image"),
          )}
        />

        <div
          className={cn(
            "mt-1 text-center text-sm text-light-foreground",
            pcn<CT>(className, "label"),
          )}
        >
          {alt}
        </div>
      </div>
    </>
  );
}
