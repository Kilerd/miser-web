import Nav from "./Nav";
import React from "react";

export default function AuthenticationLayout({children}) {
  return <>
    <main>
      <Nav/>
      <section className="body">
        {children}
      </section>

    </main>

    <style jsx>{`
      .body {
        margin-top: 4rem;
      }
    `}</style>
  </>
}
