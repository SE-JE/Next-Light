import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { BreadcrumbComponent } from "@/components/base.components/breadcrumb";

export default function Breadcrumb() {
  return (
    <>
      <div>
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
          className="mt-5"
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
          className="mt-5"
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
          className="mt-5"
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
            <span className="mx-2 bg-light-foreground/30 py-2 px-4 rounded-[20px]">
              /
            </span>
          }
        />
      </div>
    </>
  );
}

Breadcrumb.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
