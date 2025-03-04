import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { FooterComponent } from "@/components/base.components";

export default function Footer() {
  return (
    <>
      <FooterComponent />
    </>
  );
}

Footer.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
