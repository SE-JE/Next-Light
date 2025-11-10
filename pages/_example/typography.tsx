import React, { ReactNode } from "react";
import ExampleLayout from "./_layout";
import { CardComponent, TypographyArticleComponent, TypographyColumnComponent, TypographyContentComponent, TypographyTipsComponent } from "@components";

export default function Table() {
  return (
    <>
      <CardComponent className="w-1/2">
        <TypographyArticleComponent 
          title="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores ratione ipsa."
          content={<>
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
          </>}
          header="blog / article content"
          footer="Author ~ 20 January 2025"
        />
      </CardComponent>

      <CardComponent className="w-1/2 mt-5">
        <div className="flex flex-col gap-2">
          <TypographyColumnComponent title="Title Section 1:" content="Lorem ipsum dolor sit amet." />
          <TypographyColumnComponent title="Title Section 2:" content="Lorem ipsum dolor sit amet." />
        </div>
      </CardComponent>

      <CardComponent className="w-1/2 mt-5">
        <TypographyContentComponent title="Title Section" content="Sub title content section." />
      </CardComponent>

      <div className="w-1/2 mt-5">
        <TypographyTipsComponent 
          title="Tips Title" 
          content='"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            commodi autem atque voluptate dolorem beatae suscipit asperiores
            qui, alias odit."' 
        />
      </div>
    </>
  );
}

Table.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
