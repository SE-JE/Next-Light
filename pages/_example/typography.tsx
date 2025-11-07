import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { CardComponent } from "@components/.";

export default function Table() {
  return (
    <>
      <CardComponent className="w-1/2">
        <div className="text-light-foreground">blog / article content</div>
        <h1 className="text-2xl font-bold mt-2">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores
          ratione ipsa.
        </h1>
        <p className="text-justify mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit nisi
          assumenda exercitationem, explicabo pariatur hic sit ducimus
          consectetur quod, blanditiis repellendus eos. Ad harum illo adipisci
          ipsum voluptates vel sint inventore quod quia pariatur possimus
          quibusdam, ut esse numquam, quaerat voluptatibus nesciunt culpa
          excepturi ratione delectus eveniet! Voluptas, laborum et!
        </p>
        <p className="text-justify mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate sit
          voluptatibus libero quasi molestiae aliquid ullam laudantium pariatur
          similique at incidunt nemo culpa repudiandae perspiciatis labore
          soluta quo, dolor temporibus. Vitae porro deserunt dicta recusandae
          debitis ipsam distinctio mollitia veniam! Accusamus illo reiciendis
          earum libero incidunt corrupti excepturi laboriosam quos, consequatur
          quas harum assumenda cumque architecto eaque sunt fugiat asperiores.
        </p>
        <p className="text-sm text-light-foreground mt-4">
          Author ~ 20 January 2025
        </p>
      </CardComponent>

      <CardComponent className="w-1/2 mt-5">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs font-semibold text-light-foreground">
              Title Section:
            </p>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-light-foreground">
              Title Section 2:
            </p>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </CardComponent>

      <CardComponent className="w-1/2 mt-5">
        <div>
          <p className="font-semibold">Title Section</p>
          <p className="text-sm text-light-foreground">
            Sub title content section.
          </p>
        </div>
      </CardComponent>

      <CardComponent className="w-1/2 mt-5">
        <div className="pl-3 py-1 border-l-2 border-light-primary">
          <p className="font-semibold">Tips Title</p>
          <p className="text-sm text-light-foreground">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            commodi autem atque voluptate dolorem beatae suscipit asperiores
            qui, alias odit.
          </p>
        </div>
      </CardComponent>
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
