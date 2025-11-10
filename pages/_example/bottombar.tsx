import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { BottombarComponent } from "@components";

export default function BottomBar() {
  return (
    <>
      <BottombarComponent className="relative top-10" />
    </>
  );
}

BottomBar.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
