import {ProtectRoute, useAuth} from "../contexts/auth";
import React, {useState} from "react";
import AuthenticationLayout from "../components/AuthenticationLayout";
import {useLedger} from "../contexts/ledger";
import AccountListItem from "../components/AccountListItem";
import {Account, AccountListItemType} from "../types";
import NewAccountModal from "../components/NewAccountModal";
import EditAccountModal from "../components/EditAccountModal";
import Big from 'big.js'

export function accountTreeGenerator(value: { [id: number]: Account }) {
  let ret: { [name: string]: AccountListItemType } = {
    liabilities: {
      name: 'Liabilities',
      fullName: 'Liabilities',
      isAvailable: false,
      amount: new Big(0),
      alias: null,
      children: {},
      commodities: [],
      icon: "lightbulb"
    },
    assets: {
      name: 'Assets',
      fullName: 'Assets',
      isAvailable: false,
      amount: new Big(0),
      alias: null,
      children: {},
      commodities: [],
      icon: "briefcase",
    },
    equity: {
      name: 'Equity',
      fullName: 'Equity',
      isAvailable: false,
      amount: new Big(0),
      alias: null,
      children: {},
      commodities: [],
      icon: "shop"
    },
    expenses: {
      name: 'Expenses',
      fullName: 'Expenses',
      isAvailable: false,
      amount: new Big(0),
      alias: null,
      children: {},
      commodities: [],
      icon: "shopping-cart",
    },
    income: {
      name: 'Income',
      fullName: 'Income',
      isAvailable: false,
      amount: new Big(0),
      alias: null,
      children: {},
      commodities: [],
      icon: "credit-card"
    }
  };
  Object.values(value).forEach(it => {
    let strings = it.full_name.split(':');
    let accountType = strings[0].toLocaleLowerCase();
    let targetCategory = ret[accountType];
    let parents = [targetCategory];
    for (let i = 1; i < strings.length - 1; i++) {
      let item = strings[i];
      if (!(item in targetCategory.children)) {
        targetCategory.children[item] = {
          name: item,
          fullName: strings.slice(0, i + 1).join(':'),
          isAvailable: false,
          amount: new Big(0),
          commodities: [],
          children: {}
        }
      }
      targetCategory = targetCategory.children[item];
      parents.push(targetCategory);
    }
    let leafItem = strings[strings.length - 1];
    if (targetCategory.children[leafItem] === undefined) {
      targetCategory.children[leafItem] = {
        name: leafItem,
        fullName: it.full_name,
        isAvailable: true,
        alias: it.alias,
        commodities: it.commodities,
        amount: new Big(it.summary.total.value),
        id: it.id,
        children: {}
      }
    } else {
      targetCategory.children[leafItem].isAvailable = true;
      targetCategory.children[leafItem].alias = it.alias;
      targetCategory.children[leafItem].commodities = it.commodities;
      targetCategory.children[leafItem].amount = targetCategory.children[leafItem].amount.plus(it.summary.total.value);
      targetCategory.children[leafItem].id = it.id;
    }

    parents.forEach(one_parent => {
      one_parent.amount = one_parent.amount.plus(new Big(it.summary.total.value));
    })

  })
  return ret;
}


function Accounts() {

  const {user} = useAuth();
  const ledgerContext = useLedger();
  const [modalIsOpen, setIsOpen] = useState(false);

  const [editAccountData, setEditAccountData] = useState({id: null, name: "", alias: "", commodities: []});
  const [editAccountModalStatus, setEditAccountModalStatus] = useState(false);
  const openEditAccount = (id, name, alias, commodities) => {
    setEditAccountData({id, name, alias, commodities});
    setEditAccountModalStatus(true);
  }


  const accountTreeGenerator1 = accountTreeGenerator(ledgerContext.accounts);
  return (
    <>
      <AuthenticationLayout>
        <div className="container">
          <h1>Accounts</h1>
          <NewAccountModal modalStatus={modalIsOpen} setModalStatus={setIsOpen}/>
          <EditAccountModal {...editAccountData} modalStatus={editAccountModalStatus}
                            setModalStatus={setEditAccountModalStatus}/>
          <button onClick={() => setIsOpen(true)} className="button">new</button>

          <AccountListItem {...accountTreeGenerator1.assets} level={0} openEditAccount={openEditAccount}/>
          <AccountListItem {...accountTreeGenerator1.expenses} level={0} openEditAccount={openEditAccount}/>
          <AccountListItem {...accountTreeGenerator1.income} level={0} openEditAccount={openEditAccount}/>
          <AccountListItem {...accountTreeGenerator1.liabilities} level={0} openEditAccount={openEditAccount}/>
          <AccountListItem {...accountTreeGenerator1.equity} level={0} openEditAccount={openEditAccount}/>
        </div>
      </AuthenticationLayout>

      <style jsx>{`
        .container {
          max-width: 85%;
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}


export default ProtectRoute(Accounts)
