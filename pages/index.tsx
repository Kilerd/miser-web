import Head from "next/head";
import { useAuth } from "../contexts/auth";
import Login from "../components/login";
import { useRouter } from "next/router";
import React from "react";
import LoadingPage from "../components/LoadingPage";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  if (user !== undefined) {
    router.push("/dashboard");
    return <LoadingPage />;
  }
  return (
    <>
      <Head>
        <title>Miser - A double-entry accounting tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />
      <style jsx>{`
        main {
          display: flex;
          flex-direction: row;
          flex: 1;
          min-height: 100vh;
        }

        aside {
          flex: 0 0 45%;
          align-items: center;
          justify-content: center;
          display: flex;
          flex-direction: column;
          background-color: #6c63ff;
          padding: 2rem;
        }

        p.desc {
          color: #fff;
          font-size: 1.5rem;
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
          font-family: "Open Sans", -apple-system, Helvetica Neue, Helvetica,
            Open Sans, Arial, PingFang SC, PingFang TC, Hiragino Sans GB,
            Microsoft Yahei, Microsoft Jhenghei, sans-serif;
        }

        img {
          width: 300px;
          margin: 2rem 0;
        }
      `}</style>
    </>
  );
}
