import React, {createContext, useContext, useEffect, useState} from "react";
import Cookies from 'js-cookie'
import api from "../api";
import {useAuth} from "./auth";
import {Account, Commodity, IdMap, Ledger, NameMap, RESOURCE_TYPE, Transaction, User} from "../types"
import {useAsync} from "react-async-hook";
import dayjs from "dayjs";


interface LedgerContext {
  ledger_id: string | undefined,
  // transactions: IdMap<any>,
  ledgers: IdMap<Ledger>,
  accounts: IdMap<Account>,
  commodities: NameMap<Commodity>

  getAccountAlias(id: number): string,

  changeLedgerId(id: string): void,

  update(type: RESOURCE_TYPE): void;

  // loadMoreTransaction(): void;
}


function initCurrentLedger(user: User | undefined): string | undefined {
  return Cookies.get("CURRENT_LEDGER_ID") || (user?.ledgers.length > 0 ? user?.ledgers[0].toString() : undefined);
}

function initContext(): LedgerContext {
  return {
    ledger_id: Cookies.get("CURRENT_LEDGER_ID"),
    // transactions: {}
  } as LedgerContext
}


const LedgerContext = createContext(initContext());
export const useLedger = () => useContext(LedgerContext)


export const LedgerProvider = ({children}) => {
  const {user} = useAuth();
  let initialState = initCurrentLedger(user);
  api.setLedgerId(initialState);

  const [ledgerId, setLedgerId] = useState(initialState);
  // const [transactions, setTransactions] = useState<IdMap<Transaction>>({});
  const ledgers = useAsync(async () => {
    let data = await api.loadLedgers();
    if (data[ledgerId] !== null) {
      dayjs.tz.setDefault(data[ledgerId].timezone);
    }else {
      dayjs.tz.setDefault()
    }
    return data;
  }, []);

  // const transactionsR = useAsync(async () => {
  //   const res = ledgerId !== undefined ? await api.loadTransactions(null) : {};
  //   setTransactions(res);
  // }, [ledgerId]);

  const commodities = useAsync(async () => ledgerId !== undefined ? api.loadCommodities() : {}, [ledgerId]);
  const accounts = useAsync(async () => ledgerId !== undefined ? api.loadAccount() : {}, [ledgerId]);

  const update = async (type: RESOURCE_TYPE) => {
    switch (type) {
      case "TRANSACTIONS":
        // await transactionsR.execute();
        break;
      case "ACCOUNT":
        await accounts.execute();
        break;
      case "COMMODITY":
        await commodities.execute();
        break;
    }
  }

  const changeLedgerId = (id: string) => {
    Cookies.set("CURRENT_LEDGER_ID", id, {expires: 60})
    api.setLedgerId(id);
    setLedgerId(id);
    if (ledgers.result[ledgerId] !== undefined) {
      dayjs.tz.setDefault(ledgers.result[ledgerId].timezone);
    }else {
      dayjs.tz.setDefault()
    }
    // transactionsR.execute();
    commodities.execute();
    accounts.execute();

  }

  const getAccountAlias = (id: number) => {
    let account = accounts.result[id];
    return account?.alias || account?.name;
  }
  // const loadMoreTransaction = async () => {
  //   let sort = Object.values(transactions).sort((a, b) => new Date(a.create_time).getTime() - new Date(b.create_time).getTime());
  //   console.log(sort);
  //   let sortElement = sort[0];
  //   let moreRes = await api.loadTransactions(sortElement.create_time);
  //   let newTransactionMap = {...transactions};
  //   for (let moreResKey in moreRes) {
  //     newTransactionMap[moreResKey] = moreRes[moreResKey];
  //   }
  //   console.log("new", newTransactionMap);
  //   setTransactions(newTransactionMap);
  // }
  if (accounts.loading || commodities.loading || ledgers.loading) {
    return <div>ledger loading</div>
  }
  return (
    <LedgerContext.Provider
      value={{
        ledger_id: ledgerId,
        // transactions: transactions,
        ledgers: ledgers.result,
        accounts: accounts.result,
        commodities: commodities.result,
        // loadMoreTransaction,
        getAccountAlias,
        changeLedgerId,
        update
      }}>
      {children}
    </LedgerContext.Provider>
  )
}
