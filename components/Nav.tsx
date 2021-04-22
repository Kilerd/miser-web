import {useAuth} from "../contexts/auth";
import React from "react";
import {useLedger} from "../contexts/ledger";
import {
  Alignment,
  Button, Card,
  Classes, Divider, H1, Icon,
  Menu, MenuDivider,
  MenuItem,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position
} from "@blueprintjs/core";
import Link from "next/link";

export default function Nav() {
  const {user} = useAuth();
  const ledgerContext = useLedger();

  const ledgerChange = (newLedgerId) => {
    if (newLedgerId !== undefined) {
      ledgerContext.changeLedgerId(newLedgerId.toString())
    }
  }
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
            <div className="nav-btn">
              <Icon className={Classes.MINIMAL} icon="control"/>
              <p>Dashboard</p>
            </div>
          </Link>
          <Link href="/transactions">
            <div className="nav-btn">
              <Icon className={Classes.MINIMAL} icon="menu"/>
              <p>Transaction</p>
            </div>
          </Link>
          <Link href="/accounts">
            <div className="nav-btn">
              <Icon className={Classes.MINIMAL} icon="briefcase"/>
              <p>Accounts</p>
            </div>
          </Link>
          <Link href="/commodities">
            <div className="nav-btn">
              <Icon className={`${Classes.MINIMAL} nav-btn`} icon="euro"/> <p>Commodities</p>
            </div>
          </Link>
          <Link href="/schedulers">
            <div className="nav-btn">
              <Icon className={`${Classes.MINIMAL} nav-btn`} icon="euro"/> <p>Schedulers</p>
            </div>
          </Link>
        </div>
        <div className="bottom">
          <Link href="/tokens">
            <div className="nav-btn">
              <Icon className={Classes.MINIMAL} icon="cog"/>
              <p>Setting</p>
            </div>
          </Link>
          <Link href="/signout">
            <div className="nav-btn">
              <Icon className={Classes.MINIMAL} icon="small-minus"/>
              <p>Sign out</p>
            </div>
          </Link>
        </div>

      </nav>


      {/*<Navbar fixedToTop>*/}
      {/*  <div className="container">*/}
      {/*    <NavbarGroup align={Alignment.LEFT}>*/}
      {/*      <NavbarHeading>Miser</NavbarHeading>*/}
      {/*    </NavbarGroup>*/}
      {/*    <NavbarGroup align={Alignment.RIGHT}>*/}
      {/*      <Link href="/dashboard"><Button className={Classes.MINIMAL} icon="home" text="DashBoard"/></Link>*/}
      {/*      <Link href="/transactions"><Button className={Classes.MINIMAL} icon="menu" text="Transaction"/></Link>*/}
      {/*      <Link href="/accounts"><Button className={Classes.MINIMAL} icon="briefcase" text="Accounts"/></Link>*/}
      {/*      <Link href="/commodities"><Button className={Classes.MINIMAL} icon="euro" text="Commodities"/></Link>*/}


      {/*    </NavbarGroup>*/}
      {/*  </div>*/}
      {/*</Navbar>*/}


      {/*<header>*/}
      {/*  <div className="container">*/}

      {/*    <div className="left">*/}
      {/*      <h1 className="logo">Miser</h1>*/}
      {/*      <select onChange={ledgerChange} value={ledgerContext.ledger_id}>*/}
      {/*        <option>select one..</option>*/}
      {/*        {Object.values(ledgerContext.ledgers).map(it => (*/}
      {/*          <option key={it.id} value={it.id}>{it.name}</option>*/}
      {/*        ))}*/}

      {/*      </select>*/}
      {/*    </div>*/}
      {/*    <nav className="nav">*/}
      {/*      <Link href="/dashboard"><a className="link">DashBoard</a></Link>*/}
      {/*      <Link href="/transactions"><a>Transactions</a></Link>*/}
      {/*      <Link href="/accounts"><a>Accounts</a></Link>*/}
      {/*      <Link href="/commodities"><a>Commodities</a></Link>*/}
      {/*      <Link href="/me"><a>{user.username}</a></Link>*/}
      {/*    </nav>*/}
      {/*  </div>*/}
      {/*</header>*/}

      <style jsx>{`
        nav {
          background: #efefef;
          order: -1;
          flex: 0 0 16rem;
          padding: 1rem;
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
