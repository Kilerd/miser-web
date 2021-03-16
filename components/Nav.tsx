import Link from "next/link";
import {useAuth} from "../contexts/auth";
import React from "react";
import {useLedger} from "../contexts/ledger";

export default function Nav() {
  const {user} = useAuth();
  const ledgerContext = useLedger();

  const ledgerChange = (e) => {
    if (e.target.value !== undefined) {
      ledgerContext.changeLedgerId(e.target.value)
    }
  }

  return (
    <>
      <header>
        <div className="container">

          <div className="left">
            <h1 className="logo">Miser</h1>
            <select onChange={ledgerChange} value={ledgerContext.ledger_id}>
              <option>select one..</option>
              {Object.values(ledgerContext.ledgers).map(it => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}

            </select>
          </div>
          <nav className="nav">
            <Link href="/dashboard"><a className="link">DashBoard</a></Link>
            <Link href="/transactions"><a>Transactions</a></Link>
            <Link href="/accounts"><a>Accounts</a></Link>
            <Link href="/commodities"><a>Commodities</a></Link>
            <Link href="/me"><a>{user.username}</a></Link>
          </nav>
        </div>
      </header>
      <style jsx>{`
        header {
          padding: 10px 0;
          background-color: #fff;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;

          .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 90%;
            margin: 0 auto;
            padding: 0;

            .left {
              display: flex;
              align-items: center;
            }

            nav {
              display: flex;

              a {
                margin-right: 0.25rem;
                color: black;
                text-decoration: none;
              }
            }
          }
        }
      `}</style>
    </>
  )
}
