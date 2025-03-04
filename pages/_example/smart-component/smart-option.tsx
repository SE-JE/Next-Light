import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function SmartOption() {
  return (
    <>
      <div></div>
    </>
  );
}

SmartOption.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
