import styles from './layout.module.scss'
import Nav from "./Nav";
import React from "react";

export default function AuthenticationLayout({children}) {
  return <main>
    <Nav />
    {children}
  </main>
}
