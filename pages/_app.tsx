import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/normalize.css/normalize.css";
import "../node_modules/@blueprintjs/datetime/lib/css/blueprint-datetime.css"
import React, {FC} from 'react';
import {AppProps} from 'next/app'
import {AuthProvider} from "../contexts/auth";
import {LedgerProvider} from "../contexts/ledger";
import Head from "next/head";
import Modal from 'react-modal';
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import {useRouter} from "next/router";

Sentry.init({
  dsn: "https://d829aee775074f1f82198901506dbc42@o90957.ingest.sentry.io/5730812",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

Modal.setAppElement("#__next")

const WrappedApp: FC<AppProps> = ({Component, pageProps}) => {
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
