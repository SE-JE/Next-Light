import { ReactNode } from "react";
import ExampleLayout from "./_layout";
import {
  ButtonComponent,
  IconButtonComponent,
} from "@/components/base.components/button";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Button() {
  return (
    <div className="bg-white px-4 py-3 rounded-xl">
      <div className="flex flex-col gap-4">
        <p className="text-xl">Button</p>

        <div className="flex gap-4">
          <ButtonComponent label="Button Primary" />
          <ButtonComponent label="Button Secondary" paint="secondary" />
          <ButtonComponent label="Button Warning" paint="warning" />
          <ButtonComponent label="Button Danger" paint="danger" />
          <ButtonComponent label="Button Disabled" disabled />
        </div>
        <div className="flex gap-4">
          <ButtonComponent label="Button Solid" />
          <ButtonComponent label="Button Light" variant="light" />
          <ButtonComponent label="Button Outline" variant="outline" />
          <ButtonComponent label="Button Simple" variant="simple" />
        </div>
        <div className="flex gap-4 items-start">
          <ButtonComponent label="Button lg" size="lg" />
          <ButtonComponent label="Button md" size="md" />
          <ButtonComponent label="Button sm" size="sm" />
          <ButtonComponent label="Button xs" size="xs" />
        </div>
        <div className="flex gap-4 items-start">
          <ButtonComponent label="Button Custom 1" className="bg-red-500" />
          <ButtonComponent
            label="Button Custom 2"
            variant="outline"
            className="border-red-500 text-red-500 bg-red-500 bg-opacity-20"
          />
          <ButtonComponent
            label="Button Custom 3"
            variant="outline"
            className="border-slate-200 text-red-500"
          />
          <ButtonComponent
            label={
              <>
                <p>Button Custom 4</p>{" "}
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </>
            }
            className="rounded-r-full"
          />
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-1/3">
            <ButtonComponent label="Button Block" block />
          </div>
          <ButtonComponent label="Button Rounded" rounded />
          <ButtonComponent label="Button With Icon" icon={faStar} />
          <ButtonComponent label="Button Loading" loading />
        </div>

        <div className="flex gap-4 items-start">
          <IconButtonComponent icon={faStar} />
          <IconButtonComponent icon={faStar} variant="light" />
          <IconButtonComponent icon={faStar} variant="outline" />
          <IconButtonComponent icon={faStar} variant="simple" />
          <IconButtonComponent icon={faStar} size="lg" />
          <IconButtonComponent icon={faStar} size="md" />
          <IconButtonComponent icon={faStar} size="sm" />
          <IconButtonComponent icon={faStar} size="xs" />
          <IconButtonComponent icon={faStar} rounded />
          <IconButtonComponent icon={faStar} loading />
          <IconButtonComponent icon={faStar} disabled />
        </div>
      </div>
    </div>
  );
}

Button.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
