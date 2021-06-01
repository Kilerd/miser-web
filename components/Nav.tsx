import {useAuth} from "../contexts/auth";
import React from "react";
import {useLedger} from "../contexts/ledger";
import {Classes, Icon, Menu, MenuDivider, MenuItem, Popover, Position} from "@blueprintjs/core";
import Link from "next/link";
import {useRouter} from "next/router";

export default function Nav() {
  const {user, logout} = useAuth();
  const ledgerContext = useLedger();
  const router = useRouter();
  const ledgerChange = (newLedgerId) => {
    if (newLedgerId !== undefined) {
      ledgerContext.changeLedgerId(newLedgerId.toString())
    }
  }

  console.log(router);

  const name = ledgerContext.ledgers[ledgerContext.ledger_id]?.name;
  const elements = Object.values(ledgerContext.ledgers).map(ledger =>
    <MenuItem active={ledger.id.toString() === ledgerContext.ledger_id} key={ledger.id} icon="bank-account"
              onClick={() => ledgerChange(ledger.id)} text={ledger.name}/>
  );


  return (
    <>
      <nav>
        <div className="top">
          <div className="ledger">
            <Popover content={<Menu>
              {elements}
              <MenuDivider/>
              <Link href="/ledgers"><MenuItem icon="log-out" text="Manage Ledgers"/></Link>
            </Menu>} position={Position.BOTTOM}>
              <div className="current-ledger">{name} <Icon icon={"chevron-down"}/></div>
            </Popover>

          </div>

          <Link href="/dashboard">
            <div className={`nav-btn ${router.asPath === '/dashboard' ? "active" : ""}`}>
              <Icon className={Classes.MINIMAL} icon="control"/>
              <p>Dashboard</p>
            </div>
          </Link>
          <Link href="/journals">
            <div className={`nav-btn ${router.asPath === '/journals' ? "active" : ""}`}>
              <Icon className={Classes.MINIMAL} icon="menu"/>
              <p>Journals</p>
            </div>
          </Link>
          <Link href="/accounts">
            <div className={`nav-btn ${router.asPath === '/accounts' ? "active" : ""}`}>
              <Icon className={Classes.MINIMAL} icon="briefcase"/>
              <p>Accounts</p>
            </div>
          </Link>
          <Link href="/commodities">
            <div className={`nav-btn ${router.asPath === '/commodities' ? "active" : ""}`}>
              <Icon className={`${Classes.MINIMAL} nav-btn`} icon="euro"/> <p>Commodities</p>
            </div>
          </Link>
          <Link href="/schedulers">
            <div className={`nav-btn ${router.asPath === '/schedulers' ? "active" : ""}`}>
              <Icon className={`${Classes.MINIMAL} nav-btn`} icon="euro"/> <p>Schedulers</p>
            </div>
          </Link>
        </div>
        <div className="bottom">
          <Link href="/tokens">
            <div className={`nav-btn ${router.asPath === '/tokens' ? "active" : ""}`}>
              <Icon className={Classes.MINIMAL} icon="cog"/>
              <p>Setting</p>
            </div>
          </Link>
          <div className="nav-btn" onClick={logout}>
            <Icon className={Classes.MINIMAL} icon="small-minus"/>
            <p>Sign out</p>
          </div>
        </div>

      </nav>

      <style jsx>{`
        nav {
          background: #efefef;
          order: -1;
          flex: 0 0 16rem;
          padding: 3rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        div.avatar {
          display: flex;
          justify-content: center;

          img {
            border-radius: 50%;
            border: 3px #fff solid;
          }
        }

        div.ledger {
          margin-bottom: 1rem;
        }

        div.current-ledger {
          padding: 0.5rem 1rem;
          font-size: 1.15rem;
          color: #535353;
          font-weight: 500;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem 1rem;
          font-size: 1.05rem;
          border-radius: 5px;
          color: #535353;
          margin: 2px 0;

          &.active {
            background-color: #fff;
            color: #444444;
          }

          &:hover {
            background-color: #fff;
            color: #444444;
          }

          p {
            margin: 0 0 0 0.5rem;
          }
        }
      `}</style>
    </>
  )
}
