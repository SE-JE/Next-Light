import React, { ReactNode, useEffect, useState } from "react";
import { sidebarItem, sidebarProps } from "./sidebar.props";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useToggleContext } from "@/context/ToggleContext";
import Link from "next/link";

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
  onChange,
  hasAccess,
  className,
}: sidebarProps) {
  const router = useRouter();
  const { getActive } = useToggleContext();
  const [shows, setShows] = useState<string[]>([]);

  const setShow = (key: string) => {
    setShows((prevShows) =>
      prevShows?.find((pk) => pk === key)
        ? prevShows.filter((pk) => pk !== key)
        : [...prevShows, key]
    );
  };

  const checkShow = (key: string): boolean => {
    if (shows?.includes(key)) {
      return true;
    }

    return false;

    // return (
    //   nestedItems?.some((item) => {
    //     if (item?.path && cekActive(item?.path || "")) {
    //       return true;
    //     }

    //     return item.items ? checkShow(key, item.items) : false;
    //   }) ?? false
    // );
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

  return (
    <>
      <div
        className={`absolute top-0 left-0 w-full h-full bg-background bg-opacity-50 blur-md z-20 md:hidden ${
          toggle ? "scale-100 md:scale-0" : "scale-0"
        }`}
        onClick={() => onToggleChange?.()}
      ></div>
      <aside
        className={clsx(
          `flex flex-col ${
            toggle ? "scale-x-100 md:scale-x-0" : "scale-x-0 md:scale-x-100"
          } absolute md:relative w-64 h-screen px-2 py-4 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l z-20`,
          className?.container
        )}
      >
        {head}

        <nav className="flex flex-col flex-1 mt-3">
          {items?.map((menu_head, menu_head_key) => {
            return (
              <>
                <div className="px-2 pt-2">
                  <div
                    className={clsx(
                      `flex justify-between items-center text-light-foreground py-2 text-xs uppercase ${
                        menu_head?.collapse && "cursor-pointer"
                      }`,
                      className?.headList
                    )}
                    onClick={() => setShow(String(menu_head_key))}
                  >
                    <div>{menu_head?.label}</div>
                    {menu_head.collapse && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs
                            ${checkShow(String(menu_head_key)) && "rotate-180"}
                          `}
                      />
                    )}
                  </div>

                  {(!menu_head?.collapse || checkShow(String(menu_head_key))) &&
                    menu_head?.items?.map((menu, menu_key) => {
                      return (
                        <>
                          <ListWrapper
                            key={`${menu_head_key}.${menu_key}`}
                            path={
                              menu?.path ? `${basePath || ""}${menu?.path}` : ""
                            }
                            onClick={() =>
                              setShow(`${menu_head_key}.${menu_key}`)
                            }
                          >
                            <div
                              className={clsx(
                                `flex items-center justify-between px-2 py-2 gap-2 transition-colors duration-300 transform hover:text-primary cursor-pointer transition-none ${
                                  menu?.path && cekActive(menu?.path || "")
                                    ? "text-primary border-l-2 border-primary pl-4"
                                    : ""
                                }`,
                                className?.menuList
                              )}
                            >
                              <div className="flex gap-2 items-center">
                                {menu?.left_content}
                                <span className="text-sm font-medium">
                                  {menu?.label}
                                </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                {menu?.right_content}

                                {menu?.items?.length && (
                                  <FontAwesomeIcon
                                    icon={faChevronUp}
                                    className={`text-sm ${
                                      checkShow(
                                        `${menu_head_key}.${menu_key}`
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
                                    <>
                                      <ListWrapper
                                        key={`${menu_head_key}.${menu_key}.${menu_child_key}`}
                                        path={
                                          child?.path
                                            ? `${basePath || ""}${child?.path}`
                                            : ""
                                        }
                                        onClick={() =>
                                          setShow(
                                            `${menu_head_key}.${menu_key}.${menu_child_key}`
                                          )
                                        }
                                      >
                                        <div
                                          className={clsx(
                                            `flex items-center justify-between px-2 py-2 gap-2 transition-colors duration-300 transform hover:text-primary cursor-pointer transition-none border-l-2 ${
                                              child?.path &&
                                              cekActive(child?.path || "")
                                                ? "text-primary border-primary pl-4"
                                                : ""
                                            }`,
                                            className?.childList
                                          )}
                                        >
                                          <div className="flex gap-2 items-center">
                                            {child?.left_content}
                                            <span className="text-sm font-medium">
                                              {child?.label}
                                            </span>
                                          </div>
                                          <div className="flex gap-2 items-center">
                                            {child?.right_content}

                                            {child?.items?.length && (
                                              <FontAwesomeIcon
                                                icon={faChevronUp}
                                                className={`block text-sm ${
                                                  checkShow(
                                                    `${menu_head_key}.${menu_key}`
                                                  ) || "rotate-180"
                                                }`}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </ListWrapper>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function SidebarContentComponent({ children }: { children: ReactNode }) {
  return (
    <main className="w-full md:w-[calc(100vw-256px)] overflow-x-hidden">
      {children}
    </main>
  );
}
