"use client"

import Image from "next/image";
import { cn, pcn } from "@utils";



type CT = "image" | "base" | "content";

export interface ProductCardProps {
  name          :  string;
  price        ?:  string;
  image        ?:  string;
  description  ?:  string | React.ReactNode;

  /** Use custom class with: "image::", "content::". */
  className  ?:  string;
}



export function ProductCardComponent({
  image = "",
  name,
  price,
  description,
  className = "",
} : ProductCardProps) {
  return (
    <>
      <div
        className={cn(
          "rounded-[6px] border p-2 bg-white",
          pcn<CT>(className, "base"),
        )}
      >
        <Image
          src={image}
          alt={image}
          width={400}
          height={300}
          className={cn(
            "h-56 w-full rounded-[4px] object-cover",
            pcn<CT>(className, "image"),
          )}
        />

        <div className={cn("p-2", pcn<CT>(className, "content"))}>
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
