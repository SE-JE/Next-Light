import React, { ReactNode, useState } from "react";
import ExampleLayout from "./_layout";
import { ButtonComponent } from "@/components/base.components";
import { ModalComponent } from "@/components/base.components/modal/Modal.component";

export default function Modal() {
  const [show, setShow] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-5">
        <ButtonComponent label="Modal" block onClick={() => setShow("modal")} />
      </div>

      <ModalComponent
        show={show == "modal"}
        onClose={() => setShow(null)}
        title="Judul Modal"
      >
        <div className="px-4 pb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quod
          placeat omnis accusantium tenetur id voluptate quae consequuntur illo
          unde!
        </div>
      </ModalComponent>
    </>
  );
}

Modal.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
