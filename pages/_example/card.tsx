import React, { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { AlertCardComponent, CardComponent, DashboardCardComponent, GalleryCardComponent, ProductCardComponent, ProfileCardComponent } from "@components";
import ExampleLayout from "./_layout";

export default function Card() {
  return (
    <>
      <CardComponent className="w-80">Simple Card</CardComponent>
      <CardComponent className="mt-4 w-80">
        <p className="text-lg font-semibold">Card With Title & Content</p>
        <p className="text-light-foreground py-1">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error quis
          non ipsam ullam? Quod debitis harum cupiditate adipisci quam itaque.
        </p>
      </CardComponent>

      <ProductCardComponent
        name="Awesome Product Limited Edition"
        price="Rp. 100.000"
        description={
          <span className="text-xs text-light-foreground line-clamp-1 mt-2">
            Limited | Best Price | Now Ready
          </span>
        }
        image="/images/example.png"
        className={"w-80 mt-4"}
      />

      <GalleryCardComponent
        className={"w-80 mt-4"}
        src="/images/example.png"
        alt="~ Example Image Gallery ~"
      />

      <ProfileCardComponent
        name="Joko Gunawan"
        short="~ Frontend Developer"
        image="/images/example.png"
        description={
          <p className="text-light-foreground mt-4 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam nam
            debitis rem quibusdam mollitia, voluptate commodi nesciunt atque
            recusandae architecto!
          </p>
        }
        footer={
          <p className="font-semibold text-light-foreground text-sm">
            NextJs - Typescript - Tailwind CSS
          </p>
        }
        className={"w-[600] mt-4"}
      />

      <AlertCardComponent
        leftContent={
          <div
            className="hidden sm:grid sm:size-16 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border"
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faBell} className="text-3xl text-primary" />
          </div>
        }
        badge={"New Product"}
        title={"New Awesome Product Available!"}
        content={
          <p className="text-light-foreground mt-1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam nam
            debitis rem quibusdam mollitia, voluptate commodi nesciunt atque
            recusandae architecto!
          </p>
        }
        footer={<p className="text-light-foreground text-xs">5 minute ago</p>}
        className={"w-[700px] mt-4"}
      />

      <DashboardCardComponent
        className="w-64 mt-4"
        title="Total Product"
        content={<p className="text-2xl font-bold text-primary">100</p>}
        rightContent={
          <FontAwesomeIcon
            icon={faBoxArchive}
            className={`text-5xl text-primary opacity-40`}
          />
        }
      />
    </>
  );
}

Card.getLayout = function getLayout(page: ReactNode) {
  return <ExampleLayout>{page}</ExampleLayout>;
};
