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
              <div className="px-4">
                <a href="#" className="text-2xl font-extrabold italic">
                  NEXT-LIGHT v.3
                </a>
                <p className="text-sm -mt-1 font-semibold text-slate-400">
                  The Magic Starter Template
                </p>
              </div>
            }
            items={[
              {
                label: "Dashboard",
                items: [
                  {
                    label: "Dashboard",
                    leftContent: <FontAwesomeIcon icon={faTableCells} />,
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
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/accordion",
                  },
                  {
                    label: "Breadcrumb",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/breadcrumb",
                  },
                  {
                    label: "Button",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/button",
                  },
                  {
                    label: "Card",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/card",
                  },
                  {
                    label: "Carousel",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/carousel",
                  },
                  {
                    label: "Input",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/input",
                  },
                  {
                    label: "Modal",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/modal",
                  },
                  {
                    label: "Scroll Container",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/scroll-container",
                  },
                  {
                    label: "Table",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/table",
                  },
                  {
                    label: "Typography",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/typography",
                  },
                  {
                    label: "Wizard",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
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
                  {
                    label: "Smart Responsive",
                    path: "/smart-component/smart-responsive",
                  },
                ],
              },
              {
                label: "Navigation & Layout",
                collapse: true,
                items: [
                  {
                    label: "Sidebar",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/sidebar",
                  },
                  {
                    label: "Headbar",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/headbar",
                  },
                  {
                    label: "Tabbar",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/tabbar",
                  },
                  {
                    label: "Navbar",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/navbar",
                  },
                  {
                    label: "Footer",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/footer",
                  },
                  {
                    label: "Bottombar",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/bottombar",
                  },
                ],
              },
              {
                label: "Helper & Utilities",
                collapse: true,
                items: [
                  {
                    label: "Fetching Hook",
                    path: "/helper/fetching",
                  },
                  {
                    label: "Form Hook",
                    path: "/helper/form",
                  },
                  {
                    label: "Caching",
                    path: "/helper/caching",
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
