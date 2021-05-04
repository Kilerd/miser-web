import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/normalize.css/normalize.css";
import "../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css"
import * as React from 'react';
import {AuthProvider} from "../contexts/auth";
import {LedgerProvider} from "../contexts/ledger";
import Head from "next/head";
import Modal from 'react-modal';
import {useRouter} from "next/router";

Modal.setAppElement("#__next");

const WrappedApp = ({Component, pageProps}) => {
  let router = useRouter();
  if (router.asPath.startsWith("/oauth")) {
    return (
      <>
        <Head>
          <title>Miser - A double-entry accounting tool</title>
          <link rel="icon" href="/favicon.ico"/>
          <link rel="stylesheet" href="/style.css"/>
        </Head>
        <Component {...pageProps} />
      </>
    )

  }
  return (
    <>
      <Head>
        <title>Miser - A double-entry accounting tool</title>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="stylesheet" href="/style.css"/>
      </Head>
      <AuthProvider>
        <LedgerProvider>
          <Component {...pageProps} />
        </LedgerProvider>
      </AuthProvider>
    </>
  )
};

export default WrappedApp;
