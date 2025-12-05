import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faHistory, faStore, faUser } from "@fortawesome/free-solid-svg-icons";
import { ButtonComponent } from "@components";



export function NavbarComponent() {
  return (
    <>
      <div className="relative py-2.5 bg-background rounded-[6px] z-40 hidden lg:block">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <h2 className="text-base">
            Ini untuk
            <a href="" className="font-medium text-primary">
              <FontAwesomeIcon icon={faStore} className="ml-2 mr-1" /> Special
              Link
            </a>
          </h2>

          <div className="flex gap-12">
            <Link href={""}>
              <div className="px-4 text-sm text-gray-500">Tentang</div>
            </Link>
            <Link href={""}>
              <div className="px-4 text-sm text-gray-500">Artikel</div>
            </Link>
            <Link href={""}>
              <div className="px-4 text-sm text-gray-500">Bantuan</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white border-y sticky top-0 z-40">
        <div className="container flex items-center justify-between px-4 py-2.5 gap-8 mx-auto relative">
          <Link href="/">
            <div className="w-max">
              <h1 className="text-lg font-extrabold italic whitespace-nowrap">
                Next Light v.3
              </h1>
              <p className="text-xs -mt-1 font-semibold text-light-foreground">
                The Magic Starter Template
              </p>
            </div>
          </Link>

          <div className="flex gap-12 items-center">
            <div className="flex gap-12">
              <Link href={""}>
                <div className="px-4 text-base text-gray-500">Tentang</div>
              </Link>
              <Link href={""}>
                <div className="px-4 text-base text-gray-500">Artikel</div>
              </Link>
              <Link href={""}>
                <div className="px-4 text-base text-gray-500">Bantuan</div>
              </Link>
            </div>

            <div className="w-full flex items-center gap-8">
              {!false ? (
                <div className="flex w-full gap-4 justify-end">
                  <ButtonComponent
                    label={"Masuk"}
                    size={"sm"}
                    onClick={() => {}}
                  />
                  <ButtonComponent
                    label={"Daftar"}
                    size={"sm"}
                    variant="light"
                    onClick={() => {}}
                  />
                </div>
              ) : (
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
                    onClick={() => {}}
                  >
                    <div className="h-10 bg-background rounded-full aspect-square overflow-hidden flex justify-center items-center">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
