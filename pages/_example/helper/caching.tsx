import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function Caching() {
  return (
    <>
      <div></div>
    </>
  );
}

Caching.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
