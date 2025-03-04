import React, { ReactNode } from "react";
import ExampleLayout from "../_layout";

export default function Fetching() {
  return (
    <>
      <div></div>
    </>
  );
}

Fetching.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
