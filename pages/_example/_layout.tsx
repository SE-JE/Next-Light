import {
  SidebarComponent,
  SidebarContentComponent,
} from "@/components/base.components";
import { ToggleProvider } from "@/context/ToggleContext";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

export default function ExampleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToggleProvider>
        <div className="flex">
          <SidebarComponent
            basePath="/_example"
            head={
              <a href="#" className="px-4 text-2xl font-extrabold italic">
                NEXT-LIGHT v.3
              </a>
            }
            items={[
              {
                label: "Dashboard",
                items: [
                  {
                    label: "Dashboard",
                    left_content: <FontAwesomeIcon icon={faTableCells} />,
                    path: "/",
                  },
                ],
              },
              {
                label: "Component",
                collapse: true,
                items: [
                  {
                    label: "Accordion",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/accordion",
                  },
                  {
                    label: "Breadcrumb",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/breadcrumb",
                  },
                  {
                    label: "Button",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/button",
                  },
                  {
                    label: "Card",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/card",
                  },
                  {
                    label: "Carousel",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/carousel",
                  },
                  {
                    label: "Input",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/input",
                  },
                  {
                    label: "Modal",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/table",
                  },
                  {
                    label: "Table",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/table",
                  },
                  {
                    label: "Typography",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/typography",
                  },
                  {
                    label: "Wizard",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/wizard",
                  },
                ],
              },
              {
                label: "Smart Component",
                collapse: true,
                items: [
                  {
                    label: "Tabel Supervision",
                    path: "/smart-component/table",
                  },
                  {
                    label: "Form Supervision",
                    path: "/smart-component/form",
                  },
                  {
                    label: "Smart Option",
                    path: "/smart-component/smart-option",
                  },
                  {
                    label: "Smart Confirmation",
                    path: "/smart-component/smart-confirmation",
                  },
                ],
              },
              {
                label: "Navigation & Layout",
                collapse: true,
                items: [
                  {
                    label: "Sidebar",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/sidebar",
                  },
                  {
                    label: "Headbar",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/headbar",
                  },
                  {
                    label: "Tabbar",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/tabbar",
                  },
                  {
                    label: "Navbar",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/navbar",
                  },
                  {
                    label: "Mega Navbar",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/mega-navbar",
                  },
                  {
                    label: "Footer",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/mega-navbar",
                  },
                  {
                    label: "Bottombar",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/tabbar",
                  },
                ],
              },
              {
                label: "Helper & Utilities",
                collapse: true,
                items: [
                  {
                    label: "Fetching Hook",
                    path: "/",
                  },
                  {
                    label: "Form Hook",
                    path: "/",
                  },
                  {
                    label: "Caching",
                    path: "/",
                  },
                  {
                    label: "Lazy Load",
                    path: "/",
                  },
                ],
              },
            ]}
          />
          <SidebarContentComponent>
            <div className="p-4">{children}</div>
          </SidebarContentComponent>
        </div>
      </ToggleProvider>
    </>
  );
}
