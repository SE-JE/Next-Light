import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { SidebarComponent } from "@/components/base.components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLineChart } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

export default function Sidebar() {
  return (
    <>
      <SidebarComponent
        head={
          <>
            <p className="text-xl px-2">Sidebar</p>
          </>
        }
        className="h-[600px]"
        basePath="/_example/sidebar"
        items={[
          {
            label: "Dashboard",
            items: [
              {
                label: "Dashboard",
                leftContent: (
                  <FontAwesomeIcon
                    icon={faLineChart}
                    className="text-foreground/40"
                  />
                ),
                path: "/",
              },
            ],
          },
          {
            label: "Item",
            items: [
              {
                label: "Item 1",
                leftContent: <FontAwesomeIcon icon={faStar} />,
                path: "/item-1",
              },
              {
                label: "Item 2",
                leftContent: <FontAwesomeIcon icon={faStar} />,
                path: "/item-2",
              },
              {
                label: "Item 3",
                leftContent: <FontAwesomeIcon icon={faStar} />,
                path: "/item-3",
              },
            ],
          },
          {
            label: "Collapse Item",
            collapse: true,
            items: [
              {
                label: "Item 1",
                leftContent: <FontAwesomeIcon icon={faStar} />,
                items: [
                  {
                    label: "Item 1",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/item-1",
                  },
                  {
                    label: "Item 2",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/item-2",
                  },
                  {
                    label: "Item 3",
                    leftContent: <FontAwesomeIcon icon={faStar} />,
                    path: "/item-3",
                  },
                ],
              },
              {
                label: "Item 2",
                leftContent: <FontAwesomeIcon icon={faStar} />,
                path: "/item-2",
              },
              {
                label: "Item 3",
                leftContent: <FontAwesomeIcon icon={faStar} />,
                path: "/item-3",
              },
            ],
          },
        ]}
      />
    </>
  );
}

Sidebar.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
