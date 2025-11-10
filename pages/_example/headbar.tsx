import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { HeadbarComponent } from "@components";

export default function HeadBar() {
  return (
    <>
      <HeadbarComponent>
        <h1 className="text-lg font-extrabold italic whitespace-nowrap">
          Next Light v.3
        </h1>
        <p className="text-xs -mt-1 font-semibold text-light-foreground">
          The Magic Starter Template
        </p>
      </HeadbarComponent>
    </>
  );
}

HeadBar.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
