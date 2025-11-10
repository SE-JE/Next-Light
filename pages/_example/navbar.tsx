import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { NavbarComponent } from "@components";

export default function Navbar() {
  return (
    <>
      <NavbarComponent />
    </>
  );
}

Navbar.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
