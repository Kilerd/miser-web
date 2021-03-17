import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/normalize.css/normalize.css";
import React, {FC} from 'react';
import {AppProps} from 'next/app'
import {stateWrapper} from '../store';
import {useStore} from 'react-redux'
import {AuthProvider} from "../contexts/auth";
import {LedgerProvider} from "../contexts/ledger";
import Head from "next/head";
import Modal from 'react-modal';


Modal.setAppElement("#__next")

const WrappedApp: FC<AppProps> = ({Component, pageProps}) => {
  const store = useStore();
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

export default stateWrapper.withRedux(WrappedApp);
