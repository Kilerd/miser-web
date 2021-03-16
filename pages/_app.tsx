import React, {FC} from 'react';
import {AppProps} from 'next/app'
import {stateWrapper} from '../store';
import {useStore} from 'react-redux'
import {AuthProvider} from "../contexts/auth";
import {LedgerProvider} from "../contexts/ledger";
import Head from "next/head";
import Modal from 'react-modal'

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
      <style jsx global>{`
        * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
      `}</style>
    </>
  )
};

export default stateWrapper.withRedux(WrappedApp);
