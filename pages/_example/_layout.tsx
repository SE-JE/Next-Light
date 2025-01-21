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
                    label: "Button",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/button",
                  },
                  {
                    label: "Input",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    path: "/input",
                  },
                  {
                    label: "Smart Component",
                    left_content: <FontAwesomeIcon icon={faStar} />,
                    items: [
                      {
                        label: "Tabel",
                        path: "/smart-component/table",
                      },
                      {
                        label: "Form",
                        path: "/smart-component/form",
                      },
                    ],
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
