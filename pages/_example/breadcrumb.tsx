import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { BreadcrumbComponent, CardComponent } from "@components/.";

export default function Breadcrumb() {
  return (
    <>
      <CardComponent>
        <p className="text-xl mb-4">Breadcrumb</p>

        <BreadcrumbComponent
          items={[
            {
              label: "Home",
              path: "/",
            },
            {
              label: "Dashboard",
              path: "/dashboard",
            },
            {
              label: "Path",
              path: "",
            },
          ]}
        />
        <BreadcrumbComponent
          className="container::mt-4"
          items={[
            {
              label: "Home",
              path: "/",
            },
            {
              label: "Dashboard",
              path: "/dashboard",
            },
            {
              label: "Path",
              path: "",
            },
          ]}
          square
        />

        <BreadcrumbComponent
          className="container::mt-4"
          items={[
            {
              label: "Home",
              path: "/",
            },
            {
              label: "Dashboard",
              path: "/dashboard",
            },
            {
              label: "Path",
              path: "",
            },
          ]}
          separatorContent="/"
        />

        <BreadcrumbComponent
          className="container::mt-4"
          items={[
            {
              label: "Home",
              path: "/",
            },
            {
              label: "Dashboard",
              path: "/dashboard",
            },
            {
              label: "Path",
              path: "",
            },
          ]}
          square
          separatorContent={
            <span className="mx-2 bg-light-foreground/10 py-2 px-4 rounded-[6px]">
              /
            </span>
          }
        />
      </CardComponent>
    </>
  );
}

Breadcrumb.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
