import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import moment from "moment";
import 'moment/locale/id';
import "@styles/globals.css";
import { ContextAppProvider } from "@contexts/AppProvider";


moment.locale('id');
config.autoAddCss  =  false;


type NextPageWithLayout = AppProps["Component"] & {
  getLayout  ?:  (page: ReactElement) => ReactNode;
};


const font = Inter({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });


type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};


export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      <ContextAppProvider>
        <main className={font.className}>
          <Component {...pageProps} />
        </main>
      </ContextAppProvider>
    </>,
  );
}
