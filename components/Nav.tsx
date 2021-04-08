import {useAuth} from "../contexts/auth";
import React from "react";
import {useLedger} from "../contexts/ledger";
import {
  Alignment,
  Button,
  Classes,
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
  const elements = Object.values(ledgerContext.ledgers).map(ledger =>
    <MenuItem active={ledger.id.toString() === ledgerContext.ledger_id} key={ledger.id} icon="bank-account" onClick={()=> ledgerChange(ledger.id)} text={ledger.name}/>
  );


  return (
    <>


      <Navbar fixedToTop>
        <div className="container">
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Miser</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <Link href="/dashboard"><Button className={Classes.MINIMAL} icon="home" text="DashBoard"/></Link>
            <Link href="/transactions"><Button className={Classes.MINIMAL} icon="menu" text="Transaction"/></Link>
            <Link href="/accounts"><Button className={Classes.MINIMAL} icon="briefcase" text="Accounts"/></Link>
            <Link href="/commodities"><Button className={Classes.MINIMAL} icon="euro" text="Commodities"/></Link>
            <Popover content={<Menu>
              <Link href="/me"><MenuItem icon="person" text="Me"/></Link>
              <MenuDivider/>
              {elements}
              <MenuDivider/>
              <Link href="/tokens"><MenuItem icon="person" text="Tokens"/></Link>
              <MenuDivider/>
              <MenuItem icon="log-out" text="Sign out"/>
            </Menu>} position={Position.BOTTOM}>
              <Button className={Classes.MINIMAL} icon="user" text={user.username}/>
            </Popover>

          </NavbarGroup>
        </div>
      </Navbar>


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
    </>
  )
}
