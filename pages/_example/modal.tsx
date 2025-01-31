import React, { ReactNode, useState } from "react";
import ExampleLayout from "./_layout";
import { ButtonComponent } from "@/components/base.components";
import { ModalComponent } from "@/components/base.components/modal/Modal.component";
import { FloatingPageComponent } from "@/components/base.components/modal/FloatingPage.component";
import { ModalConfirmComponent } from "@/components/base.components/modal/ModalConfirm.component";
import { ToastComponent } from "@/components/base.components/modal/Toast";

export default function Modal() {
  const [show, setShow] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-5">
        <ButtonComponent label="Modal" block onClick={() => setShow("modal")} />
        <ButtonComponent
          label="Floating Page"
          block
          onClick={() => setShow("floating-page")}
        />
        <ButtonComponent
          label="Modal Confirm"
          block
          onClick={() => setShow("modal-confirm")}
        />
        <ButtonComponent label="Toast" block onClick={() => setShow("toast")} />
      </div>

      <ModalComponent
        show={show == "modal"}
        onClose={() => setShow(null)}
        title="Judul Modal"
        footer={
          <div className="text-xs text-light-foreground">
            Click outer "x" or outer modal to close
          </div>
        }
        className=""
      >
        <div className="px-4 pb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quod
          placeat omnis accusantium tenetur id voluptate quae consequuntur illo
          unde!
        </div>
      </ModalComponent>

      <FloatingPageComponent
        show={show == "floating-page"}
        onClose={() => setShow(null)}
        title="Title Page"
        footer={
          <div className="text-xs text-light-foreground">
            Click outer "x" or outer modal to close
          </div>
        }
        className="bg-white"
      >
        <div className="px-4 pb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis quod
          placeat omnis accusantium tenetur id voluptate quae consequuntur illo
          unde!
        </div>
      </FloatingPageComponent>

      <ModalConfirmComponent
        show={show == "modal-confirm"}
        onClose={() => setShow(null)}
        title="Modal Confirm?"
      />

      <ToastComponent
        show={show == "toast"}
        onClose={() => setShow(null)}
        title="Toast Showing!"
      >
        <div className="px-2 pb-4 text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga,
          repellat.
        </div>
      </ToastComponent>
    </>
  );
}

Modal.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
