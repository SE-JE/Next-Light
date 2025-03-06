import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { cn, pcn } from "@/helpers";

type CT = "backdrop" | "base" | "head-item" | "item" | "child-item";

export type SidebarItemType = {
  label: string;
  key?: number;
  leftContent?: any;
  rightContent?: any;
  path?: string;
  items?: SidebarItemType[];
  className?: string;
};

export type SidebarHeadItemType = {
  label: string;
  collapse?: boolean;
  items?: SidebarItemType[];
  className?: string;
};

export type sidebarProps = {
  head?: any;
  items?: SidebarHeadItemType[];
  basePath?: string;
  show?: boolean;
  toggle?: boolean;
  onToggleChange?: () => void;
  children?: any;
  hasAccess?: number[];
  onChange?: () => void;

  /** Use custom class with: "backdrop::", "head-item::", "item::", "child-item::". */
  className?: string;
};

function ListWrapper({
  path,
  children,
  onClick,
}: {
  path?: string;
  onClick?: () => void;
  children?: any;
}) {
  if (path) {
    return <Link href={path}>{children}</Link>;
  } else {
    return <div onClick={() => onClick?.()}>{children}</div>;
  }
}

export function SidebarComponent({
  head,
  items,
  basePath,
  toggle,
  onToggleChange,
  // onChange,
  // hasAccess,
  className = "",
}: sidebarProps) {
  const router = useRouter();
  // const { getActive } = useToggleContext();
  const [shows, setShows] = useState<string[]>([]);

  const setShow = (key: string) => {
    setShows((prevShows) =>
      prevShows?.find((pk) => pk === key)
        ? prevShows.filter((pk) => pk !== key)
        : [...prevShows, key],
    );
  };

  const checkShow = (key: string): boolean => {
    if (shows?.includes(key)) {
      return true;
    }

    return false;
  };

  const cekActive = (path: string) => {
    const activePath =
      router.asPath?.split("?")[0]?.replace(`${basePath || ""}`, "") || "/";

    const currentPath = `${path ? `${path}` : ""}`;

    const isPrefix = (longer: string, shorter: string): boolean => {
      return (
        longer.startsWith(shorter) &&
        (longer === shorter || longer[shorter.length] === "/")
      );
    };

    return (
      isPrefix(activePath, currentPath) || isPrefix(currentPath, activePath)
    );
  };

  useEffect(() => {
    items?.map((head, head_key) => {
      head?.items?.map((menu, key) => {
        if (menu?.path && cekActive(menu?.path || "")) {
          setShow(`${head_key}`);
        }
        menu?.items?.map((child) => {
          if (child?.path && cekActive(child?.path || "")) {
            setShow(`${head_key}`);
            setShow(`${head_key}.${key}`);
          }
        });
      });
    });
  }, []);

  const styles = {
    backdrop: cn(
      "absolute top-0 left-0 w-full h-full bg-background bg-opacity-50 blur-md z-20 md:hidden",
      toggle ? "scale-100 md:scale-0" : "scale-0",
      pcn<CT>(className, "backdrop"),
    ),
    base: cn(
      "flex flex-col fixed w-64 h-screen px-2 py-4 overflow-y-auto bg-white z-20 rounded-r-[8px] border-r scroll",
      toggle ? "scale-x-100 md:scale-x-0" : "scale-x-0 md:scale-x-100",
      pcn<CT>(className, "base"),
    ),
    headItem:
      "flex justify-between items-center text-light-foreground font-semibold py-2 text-xs uppercase",
    item: "flex items-center justify-between px-2 py-2 gap-2 transition-colors duration-300 transform hover:text-primary cursor-pointer transition-none",
    childItem:
      "flex items-center justify-between px-2 py-2 gap-2 transition-colors duration-300 transform hover:text-primary cursor-pointer transition-none border-l-2",
  };

  return (
    <>
      <div className={styles.backdrop} onClick={() => onToggleChange?.()}></div>
      <aside className={styles.base}>
        {head}
        <nav className="flex flex-col flex-1 mt-3">
          {items?.map((menu_head, menu_head_key) => {
            return (
              <Fragment key={menu_head_key}>
                <div className="px-2 pt-2">
                  <div
                    className={cn(
                      styles.headItem,
                      menu_head?.collapse && "cursor-pointer",
                      pcn<CT>(className, "head-item"),
                      menu_head?.className,
                    )}
                    onClick={() => setShow(String(menu_head_key))}
                  >
                    {menu_head?.label}
                    {menu_head.collapse && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={cn(
                          "text-xs",
                          checkShow(String(menu_head_key)) && "rotate-180",
                        )}
                      />
                    )}
                  </div>

                  {(!menu_head?.collapse || checkShow(String(menu_head_key))) &&
                    menu_head?.items?.map((menu, menu_key) => {
                      return (
                        <Fragment key={`${menu_head_key}.${menu_key}`}>
                          <ListWrapper
                            path={
                              menu?.path ? `${basePath || ""}${menu?.path}` : ""
                            }
                            onClick={() =>
                              setShow(`${menu_head_key}.${menu_key}`)
                            }
                          >
                            <div
                              className={cn(
                                styles.item,
                                menu?.path &&
                                  cekActive(menu?.path || "") &&
                                  "text-primary border-l-2 border-primary pl-4",
                                pcn<CT>(className, "item"),
                                menu?.className,
                              )}
                            >
                              <div className="flex gap-2 items-center">
                                {menu?.leftContent}
                                <span className="text-sm font-medium">
                                  {menu?.label}
                                </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                {menu?.rightContent}

                                {menu?.items?.length && (
                                  <FontAwesomeIcon
                                    icon={faChevronUp}
                                    className={`text-sm ${
                                      checkShow(
                                        `${menu_head_key}.${menu_key}`,
                                      ) || "rotate-180"
                                    }`}
                                  />
                                )}
                              </div>
                            </div>
                          </ListWrapper>
                          <div className="px-4">
                            <div className="flex flex-col">
                              {menu?.items?.length &&
                                checkShow(`${menu_head_key}.${menu_key}`) &&
                                menu?.items?.map((child, menu_child_key) => {
                                  return (
                                    <Fragment
                                      key={`${menu_head_key}.${menu_key}.${menu_child_key}`}
                                    >
                                      <ListWrapper
                                        path={
                                          child?.path
                                            ? `${basePath || ""}${child?.path}`
                                            : ""
                                        }
                                        onClick={() =>
                                          setShow(
                                            `${menu_head_key}.${menu_key}.${menu_child_key}`,
                                          )
                                        }
                                      >
                                        <div
                                          className={cn(
                                            styles.childItem,
                                            child?.path &&
                                              cekActive(child?.path || "") &&
                                              "text-primary border-primary pl-4",
                                            pcn<CT>(className, "child-item"),
                                            child?.className,
                                          )}
                                        >
                                          <div className="flex gap-2 items-center">
                                            {child?.leftContent}
                                            <span className="text-sm font-medium">
                                              {child?.label}
                                            </span>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            {child?.rightContent}

                                            {child?.items?.length && (
                                              <FontAwesomeIcon
                                                icon={faChevronUp}
                                                className={`block text-sm ${
                                                  checkShow(
                                                    `${menu_head_key}.${menu_key}`,
                                                  ) || "rotate-180"
                                                }`}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </ListWrapper>
                                    </Fragment>
                                  );
                                })}
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                </div>
              </Fragment>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function SidebarContentComponent({ children }: { children: ReactNode }) {
  return (
    <main className="w-full md:ml-[256px] md:w-[calc(100vw-256px)] min-h-screen overflow-x-hidden">
      {children}
    </main>
  );
}
