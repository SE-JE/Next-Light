import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { CarouselComponent } from "@components";

export default function Carousel() {
  return (
    <>
      <CarouselComponent
        items={[
          { background: "/images/example.png", content: "First Slide" },
          { background: "/images/example.png", content: "Second Slide" },
          { background: "/images/example.png", content: "Third Slide" },
        ]}
      />
    </>
  );
}

Carousel.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
