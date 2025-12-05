"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCrosshairs, faHome, faSackDollar, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn, useKeyboardOpen } from "@utils";



export interface BottombarProps {
  active     ?:  string;
  className  ?:  string;
}



export function BottombarComponent({
  className = "",
  active,
}: BottombarProps) {
  const pathname = usePathname();
  const isKeyboardOpen  =  useKeyboardOpen();

  const styles = {
    base: cn(
      "fixed left-1/2 -translate-x-1/2 w-[96%] max-w-[400px] p-2 px-4 bg-white border rounded-[6px] z-40",
      isKeyboardOpen ? "-bottom-60" : "bottom-3",
      pcn(className, "base"),
    ),
    item: "flex justify-center items-center flex-col py-3 rounded-[6px]",
  };

  return (
    <>
      <div className={styles.base}>
        <div className="grid grid-cols-5 gap-2 items-center">
          <Link href={"/_example/bottombar"}>
            <div
              className={cn(
                styles.item,
                (pathname == "/_example/bottombar" || active == "home") &&
                  "border-b bg-background text-primary",
                pcn(className, "item"),
                (pathname == "/_example/bottombar" || active == "home") &&
                  pcn(className, "active"),
              )}
            >
              <FontAwesomeIcon icon={faHome} />
            </div>
          </Link>

          <Link href={"/"}>
            <div
              className={cn(
                styles.item,
                (pathname == "" || active == "home") &&
                  "border-b bg-background text-primary",
                pcn(className, "item"),
                (pathname == "" || active == "home") &&
                  pcn(className, "active"),
              )}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </div>
          </Link>

          <Link href={"/"}>
            <div
              className={cn(
                styles.item,
                (pathname == "" || active == "home") &&
                  "border-b bg-background text-primary",
                pcn(className, "item"),
                (pathname == "" || active == "home") &&
                  pcn(className, "active"),
              )}
            >
              <FontAwesomeIcon icon={faCrosshairs} />
            </div>
          </Link>

          <Link href={"/"}>
            <div
              className={cn(
                styles.item,
                (pathname == "" || active == "home") &&
                  "border-b bg-background text-primary",
                pcn(className, "item"),
                (pathname == "" || active == "home") &&
                  pcn(className, "active"),
              )}
            >
              <FontAwesomeIcon icon={faSackDollar} />
            </div>
          </Link>

          <Link href={"/"}>
            <div
              className={cn(
                styles.item,
                (pathname == "" || active == "home") &&
                  "border-b bg-background text-primary",
                pcn(className, "item"),
                (pathname == "" || active == "home") &&
                  pcn(className, "active"),
              )}
            >
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
