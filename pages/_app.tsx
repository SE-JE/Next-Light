import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";

type NextPageWithLayout = AppProps["Component"] & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const font = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
