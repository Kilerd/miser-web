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
      main {
        display: flex;
        flex-direction: row;
        height: 100vh;
      }

      section.body {
        padding: 1rem;
        flex: 1;
        overflow: scroll;
      }
    `}</style>
  </>
}
