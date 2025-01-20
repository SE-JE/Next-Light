import React, { useState } from "react";
import { sidebarItem, sidebarProps } from "./sidebar.props";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useToggleContext } from "@/context/ToogleContext";
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

export default function SidebarComponent({
  head,
  items,
  basePath,
  toggle,
  children,
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

  const checkShow = (key: string, nestedItems?: sidebarItem[]): boolean => {
    if (shows?.includes(key)) {
      return true;
    }

    return (
      nestedItems?.some((item) => {
        const activePath = router.asPath?.split("?")[0];
        const currentPath = `${basePath || ""}${
          item.path ? `/${item.path}` : ""
        }`;

        if (
          currentPath === activePath ||
          getActive(`sidebar_${basePath}`) === item.path
        ) {
          return true;
        }

        return item.items ? checkShow(key, item.items) : false;
      }) ?? false
    );
  };

  const cekActive = (path: string) => {
    const activePath = router.asPath?.split("?")[0];

    const currentPath = `${basePath || ""}${path ? `${path}` : ""}`;

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

  return (
    <>
      <aside
        className={clsx(
          "flex flex-col w-64 h-screen px-2 py-4 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l",
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
                    className={`flex justify-between items-center cursor-pointer text-light-foreground py-2 ${
                      menu_head?.collapse && "cursor-pointer"
                    }`}
                    onClick={() => setShow(String(menu_head_key))}
                  >
                    <label className="text-xs uppercase">
                      {menu_head?.label}
                    </label>
                    {menu_head.collapse && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs
                            ${
                              checkShow(
                                String(menu_head_key),
                                menu_head?.items
                              ) && "rotate-180"
                            }
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
                            path={menu?.path || ""}
                            onClick={() =>
                              setShow(`${menu_head_key}.${menu_key}`)
                            }
                          >
                            <div
                              className={`flex items-center justify-between px-2 py-2 gap-2 transition-colors duration-300 transform hover:text-primary cursor-pointer transition-none ${
                                menu?.path && cekActive(menu?.path || "")
                                  ? "text-primary border-l-2 border-primary pl-4"
                                  : ""
                              }`}
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
                                    className={`block md:hidden lg:block text-sm ${
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
                            <div className="flex flex-col border-l-2">
                              {menu?.items?.length &&
                                checkShow(`${menu_head_key}.${menu_key}`) &&
                                menu?.items?.map((menu, menu_child_key) => {
                                  return (
                                    <>
                                      <ListWrapper
                                        key={`${menu_head_key}.${menu_key}.${menu_child_key}`}
                                        path={menu?.path || ""}
                                        onClick={() =>
                                          setShow(
                                            `${menu_head_key}.${menu_key}.${menu_child_key}`
                                          )
                                        }
                                      >
                                        <div
                                          className={`flex items-center justify-between px-2 py-2 gap-2 transition-colors duration-300 transform hover:text-primary cursor-pointer transition-none ${
                                            menu?.path &&
                                            cekActive(menu?.path || "")
                                              ? "text-primary border-l-2 border-primary pl-4"
                                              : ""
                                          }`}
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
                                                className={`block md:hidden lg:block text-sm ${
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
