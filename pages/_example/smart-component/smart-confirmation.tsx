import React, { ReactNode, useState } from "react";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import ExampleLayout from "../_layout";
import { ButtonComponent, ModalConfirmComponent } from "@components";

export default function SmartConfirmation() {
  const [show, setShow] = useState(false);

  return (
    <>
      <ButtonComponent label="Konfirmasi" onClick={() => setShow(true)} />
      <ModalConfirmComponent
        show={show}
        onClose={() => setShow(false)}
        icon={faQuestionCircle}
        title={`Konfirmasi`}
        submitControl={{
          onSubmit: {
            method: "POST",
            path: "confirmation",
          },
          onSuccess: () => {
            setShow(true);
          },
        }}
      >
        <p className="px-2 pb-2 text-sm text-center">
          Yakin ingin melakukan ini?
        </p>
      </ModalConfirmComponent>
    </>
  );
}

SmartConfirmation.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
