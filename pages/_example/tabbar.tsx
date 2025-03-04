import React, { ReactNode, useState } from "react";
import ExampleLayout from "./_layout";
import { TabbarComponent } from "@/components/base.components";

export default function Tabbar() {
  const [active, setActive] = useState<string | number>("Menu 1");
  return (
    <>
      <TabbarComponent
        items={["Menu 1", "Menu 2", "Menu 3"]}
        active={active}
        onChange={(e) => setActive(e)}
        className="w-[500px]"
      />
    </>
  );
}

Tabbar.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
