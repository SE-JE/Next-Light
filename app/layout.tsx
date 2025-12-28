import { ReactNode } from "react";

import { Roboto } from "next/font/google";
import "@styles/globals.css";

import moment from "moment";
import "moment/locale/id";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { ContextAppProvider } from "@contexts/AppProvider";
import { ShortcutProvider } from "@components";

moment.locale("id");
config.autoAddCss = false;


const font = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});


export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={font.className}>
      <body className="antialiased">
        <ContextAppProvider>
        <ShortcutProvider />
          {children}
        </ContextAppProvider>
      </body>
    </html>
  );
}