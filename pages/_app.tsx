import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/normalize.css/normalize.css";
import "../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import * as React from "react";
import { useEffect } from "react";
import Head from "next/head";
import Modal from "react-modal";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LedgerProvider } from "../contexts/ledger";
import { AuthProvider } from "../contexts/auth";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

Modal.setAppElement("#__next");

export const AppToaster = null;

const WrappedApp = ({ Component, pageProps }) => {
  const router = useRouter();
  if (router.asPath.startsWith("/oauth")) {
    return (
      <>
        <Head>
          <title>Miser - A double-entry accounting tool</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/style.css" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }

  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <title>Miser - A double-entry accounting tool</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <AuthProvider>
        <LedgerProvider>
          <Component {...pageProps} />
        </LedgerProvider>
      </AuthProvider>
    </>
  );
};

export default WrappedApp;
