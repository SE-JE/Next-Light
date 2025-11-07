import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { AccordionComponent, CardComponent } from "@components/.";

export default function Accordion() {
  return (
    <>
      <CardComponent>
        <p className="text-xl mb-4">Accordion</p>

        <AccordionComponent
          items={[
            {
              head: "Accordion #1",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis cum necessitatibus expedita, et eveniet, perspiciatis reprehenderit repudiandae recusandae temporibus molestias minus saepe veniam rerum? Ex nihil nam ipsa at quidem!",
            },
            {
              head: "Accordion #2",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis cum necessitatibus expedita, et eveniet, perspiciatis reprehenderit repudiandae recusandae temporibus molestias minus saepe veniam rerum? Ex nihil nam ipsa at quidem!",
            },
          ]}
        />

        <div className="mt-4"></div>
        <AccordionComponent
          items={[
            {
              head: (
                <div style={{ writingMode: "vertical-rl" }}>Accordion #1</div>
              ),
              content: (
                <div className="w-[500px]">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. A
                  officia pariatur quia placeat. Enim commodi earum veniam
                  laborum unde fugiat, sed ad deserunt at reprehenderit minus
                  in, voluptates rem vero!
                </div>
              ),
            },
            {
              head: (
                <div style={{ writingMode: "vertical-rl" }}>Accordion #1</div>
              ),
              content: (
                <div className="w-[500px]">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. A
                  officia pariatur quia placeat. Enim commodi earum veniam
                  laborum unde fugiat, sed ad deserunt at reprehenderit minus
                  in, voluptates rem vero!
                </div>
              ),
            },
          ]}
          horizontal
        />
      </CardComponent>
    </>
  );
}

Accordion.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
