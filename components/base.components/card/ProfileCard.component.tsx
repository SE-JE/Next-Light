"use client"

import Image from "next/image";
import { cn, pcn } from "@utils";



type CT = "image" | "base" | "content";

export interface ProfileCardProps {
  name          :  string;
  short        ?:  string;
  image        ?:  string;
  description  ?:  string | React.ReactNode;
  footer       ?:  string | React.ReactNode;

  /** Use custom class with: "image::", "content::". */
  className  ?:  string;
}



export function ProfileCardComponent({
  image  =  "",
  name,
  short,
  description,
  footer,
  className  =  "",
} : ProfileCardProps) {
  return (
    <>
      <div
        className={cn(
          "relative block overflow-hidden rounded-[6px] border bg-white p-4 sm:p-6",
          pcn<CT>(className, "base"),
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
                className={cn(
                  "size-16 rounded-full object-cover shadow-sm",
                  pcn<CT>(className, "image"),
                )}
              />
            </div>
          )}
          <div className={pcn<CT>(className, "content")}>
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
