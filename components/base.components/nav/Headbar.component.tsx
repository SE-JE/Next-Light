"use client"

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHistory, faPowerOff, faUser, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { OutsideClickComponent } from "@components";
import { cn, auth } from "@utils";



export interface HeadbarProps {
  children   ?:  ReactNode;
  className  ?:  string;
};




export function HeadbarComponent({
  children,
  className = "",
}: HeadbarProps) {
  const router                 =  useRouter();
  const [profile, setProfile]  =  useState(false);

  const styles = {
    base: cn(
      "p-1 flex items-center justify-between bg-white rounded-[6px] relative z-30 select-none border px-4 py-2",
      className,
    ),
  };

  return (
    <div className={styles.base}>
      <div className="w-full ">{children}</div>

      <div className="flex gap-2 w-max items-center">
        <div className="p-2 text-light-foreground hover:text-foreground cursor-pointer">
          <FontAwesomeIcon icon={faHistory} />
        </div>
        <div className="p-2 text-light-foreground hover:text-foreground cursor-pointer">
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className="h-5 w-[1px] bg-foreground mx-2.5"></div>
        <div
          className="flex items-center gap-2.5 px-4 cursor-pointer -ml-2 text-light-foreground hover:text-foreground"
          onClick={() => setProfile(!profile)}
        >
          <div className="h-10 bg-background rounded-full aspect-square overflow-hidden flex justify-center items-center">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div className="hidden lg:block w-max max-w-[110px]">
            <h6 className="text-sm font-semibold line-clamp-1">Jhon Duck</h6>
            <h6 className="-mt-0.5 text-xs font-medium line-clamp-1">Admin</h6>
          </div>
        </div>
      </div>

      <OutsideClickComponent onOutsideClick={() => setProfile(false)}>
        <div
          className={`absolute right-0 top-[70px] rounded-[6px] border overflow-hidden bg-white z-30 ${
            profile ? "scale-y-100" : "scale-y-0"
          }`}
        >
          <div className="flex items-center gap-4 p-4 rounded-b-[4px] border-b">
            <div className="h-14 bg-background border rounded-full aspect-square overflow-hidden flex justify-center items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-2xl text-light-foreground"
              />
            </div>
            <div className="pr-5 w-[160px]">
              <h6 className="text-lg font-bold line-clamp-1">Jhon Duck</h6>
              <h6 className="text-xs -mt-1 font-semibold line-clamp-1">
                Admin
              </h6>
            </div>
          </div>

          <div className="py-4">
            <div className="px-6 py-2 flex gap-4 hover:bg-background/40 hover:border-y items-center cursor-pointer">
              <FontAwesomeIcon icon={faUserCog} />
              <label className="cursor-pointer font-semibold">
                Edit Profile
              </label>
            </div>
            <div
              className="px-6 py-2 flex gap-4 hover:bg-background/40 hover:border-y items-center cursor-pointer text-danger"
              onClick={() => {
                auth.deleteAccessToken();
                router.push("/");
              }}
            >
              <FontAwesomeIcon icon={faPowerOff} />
              <label className="cursor-pointer font-semibold">Keluar</label>
            </div>
          </div>
        </div>
      </OutsideClickComponent>
    </div>
  );
}
