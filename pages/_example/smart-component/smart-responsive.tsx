import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function SmartResponsive() {
  return (
    <>
      <div></div>
    </>
  );
}

SmartResponsive.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
