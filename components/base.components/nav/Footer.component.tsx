import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";



export function FooterComponent() {
  return (
    <>
      <div className="bg-white/50 backdrop-blur-md border-t-2 pt-[100px] pb-16">
        <div className="container mx-auto px-4 lg:px-52 text-center">
          <h1 className="text-4xl font-extrabold italic whitespace-nowrap">
            Next Light v.3
          </h1>
          <p className="text-lg font-semibold text-light-foreground">
            The Magic Starter Template
          </p>
        </div>

        <div className="flex flex-col justify-center items-center mt-16 gap-4 px-4">
          <a
            href="https://maps.app.goo.gl/TY2QDjFPm3RfwjUq6"
            className="font-medium cursor-pointer hover:border-b border-foreground"
          >
            Soekarno Hatta No 27 C, Ponorogo, Jawa Timur, Indonesia
          </a>
          <a
            href="https://wa.me/6281456140392"
            className="font-medium cursor-pointer hover:border-b border-foreground"
          >
            +62 888888888888
          </a>
          <a
            href="mailto:sejedigital@gmail.com"
            className="font-medium cursor-pointer hover:border-b border-foreground"
          >
            example@gmail.com
          </a>
          <p className="font-medium text-center">
            24 / 7 Online Suport | Senin - Sabtu ( 09.00 s/d 17.00 )
          </p>

          <div className="flex mt-10 gap-4 justify-center">
            <a href="">
              <FontAwesomeIcon
                icon={faFacebook}
                className="text-2xl hover:scale-110"
              />
            </a>
            <a href="">
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-2xl hover:scale-110"
              />
            </a>
            <a href="https://github.com/SE-JE">
              <FontAwesomeIcon
                icon={faGithub}
                className="text-2xl hover:scale-110"
              />
            </a>
            <a href="https://www.instagram.com/seje.digital/">
              <FontAwesomeIcon
                icon={faInstagram}
                className="text-2xl hover:scale-110"
              />
            </a>
          </div>
        </div>

        <div className="container mx-auto px-6 bg-white border-y mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-4 py-12 px-12">
            <nav aria-label="Footer navigation">
              <h6 className="text-lg font-semibold text-foreground mb-4">
                Link Menu
              </h6>

              <div className="flex flex-col gap-2">
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
              </div>
            </nav>
            <nav aria-label="Footer navigation">
              <h6 className="text-lg font-semibold text-foreground mb-4">
                Link Menu
              </h6>

              <div className="flex flex-col gap-2">
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
              </div>
            </nav>
            <nav aria-label="Footer navigation">
              <h6 className="text-lg font-semibold text-foreground mb-4">
                Link Menu
              </h6>

              <div className="flex flex-col gap-2">
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
                <Link href="" className="text-light-foreground hover:underline">
                  Klik Link Menu 1
                </Link>
              </div>
            </nav>
          </div>
        </div>
        <p className="text-lg text-center font-semibold mt-16">
          Copyright &copy;
          <a href="https://sejedigital.com/" className="ml-1" target="_blank">
            sejedigital.com 2020 - 2025
          </a>
        </p>
      </div>
    </>
  );
}
