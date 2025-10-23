import {
  SidebarComponent,
  SidebarContentComponent,
} from "@/components/base.components";
import React, { ReactNode } from "react";

export default function ExampleLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
              label: "Introduction",
              items: [
                {
                  label: "Apa Itu Next-Light",
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
                  path: "/accordion",
                },
                {
                  label: "Breadcrumb",
                  path: "/breadcrumb",
                },
                {
                  label: "Button",
                  path: "/button",
                },
                {
                  label: "Card",
                  path: "/card",
                },
                {
                  label: "Carousel",
                  path: "/carousel",
                },
                {
                  label: "Input",
                  path: "/input",
                },
                {
                  label: "Modal",
                  path: "/modal",
                },
                {
                  label: "Scroll Container",
                  path: "/scroll-container",
                },
                {
                  label: "Table",
                  path: "/table",
                },
                {
                  label: "Typography",
                  path: "/typography",
                },
                {
                  label: "Wizard",
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
                  path: "/sidebar",
                },
                {
                  label: "Headbar",
                  path: "/headbar",
                },
                {
                  label: "Tabbar",
                  path: "/tabbar",
                },
                {
                  label: "Navbar",
                  path: "/navbar",
                },
                {
                  label: "Footer",
                  path: "/footer",
                },
                {
                  label: "Bottombar",
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
          <div className="p-2 lg:p-4">{children}</div>
        </SidebarContentComponent>
      </div>
    </>
  );
}
