import Head from 'next/head'
import {useAuth} from "../contexts/auth";
import Login from "../components/login";
import {useRouter} from "next/router";
import React from "react";

export default function Home() {

  const {user} = useAuth();
  const router = useRouter();
  if (user !== undefined) {
    router.push("/dashboard");
    return <div>redirecting...</div>
  }
  return (
    <div className="container">
      <Head>
        <title>Miser - A double-entry accounting tool</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <aside>
          <img src="/images/saving.svg" alt="saving"/>
          <p className="desc">Make double-entry accounting simple, but significant effect</p>
        </aside>
        <section>
          <h1>Miser</h1>
          <Login/>

        </section>

      </main>
      <style jsx>{`
        main {
          display: flex;
          flex-direction: row;
          flex:1;
          min-height: 100vh;
        }
        aside {
          flex: 0 0 45%;
          align-items: center;
          justify-content: center;
          display: flex;
          flex-direction: column;
          background-color:#6C63FF;
          padding: 2rem;
        }
        p.desc {
          color: #fff;
          font-size:1.5rem;
        }
        section {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4rem 6rem 10rem 4rem;
          justify-content: space-between;
        }
        h1 {
          display: inline-block;
          font-size: 2.5rem;
          font-weight: 600;
          min-height: 1.4em;
          margin-left: -2px;
          line-height: 1.4em;
          font-family: 'Open Sans',-apple-system,Helvetica Neue,Helvetica,Open Sans,Arial,PingFang SC,PingFang TC,Hiragino Sans GB,Microsoft Yahei,Microsoft Jhenghei,sans-serif;
        }
        img {
          width: 300px;
          margin: 2rem 0;
        }
        `}</style>
    </div>


  )
}
