import React, {createContext, useContext, useEffect, useState} from "react";
import Cookies from 'js-cookie'
import api from "../api";
import {useAuth} from "./auth";
import {Account, Commodity, IdMap, Ledger, NameMap, RESOURCE_TYPE, User} from "../types"
import {useAsync} from "react-async-hook";


interface LedgerContext {
  ledger_id: string | undefined,
  transactions: IdMap<any>,
  ledgers: IdMap<Ledger>,
  accounts: IdMap<Account>,
  commodities: NameMap<Commodity>

  getAccountAlias(id: number): string,

  changeLedgerId(id: string): void,

  update(type: RESOURCE_TYPE): void;

  initLoading: boolean
}


function initCurrentLedger(user: User | undefined): string | undefined {
  return Cookies.get("CURRENT_LEDGER_ID") || (user?.ledgers.length > 0 ? user?.ledgers[0].toString() : undefined);
}

function initContext(): LedgerContext {
  return {
    ledger_id: Cookies.get("CURRENT_LEDGER_ID"),
    transactions: {}
  } as LedgerContext
}


const LedgerContext = createContext(initContext());
export const useLedger = () => useContext(LedgerContext)


export const LedgerProvider = ({children}) => {
  const {user} = useAuth();
  let initialState = initCurrentLedger(user);
  api.setLedgerId(initialState);
  const [ledgerId, setLedgerId] = useState(initialState);
  const ledgers = useAsync(async () => api.loadLedgers(), []);
  const transactions = useAsync(async () => ledgerId !== undefined ? api.loadTransactions() : {}, [ledgerId]);
  const commodities = useAsync(async () => ledgerId !== undefined ? api.loadCommodities() : {}, [ledgerId]);
  const accounts = useAsync(async () => ledgerId !== undefined ? api.loadAccount() : {}, [ledgerId]);

  const update = async (type: RESOURCE_TYPE) => {
    switch (type) {
      case "TRANSACTIONS":
        await transactions.execute();
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
    transactions.execute();
    commodities.execute();
    accounts.execute();
  }

  const getAccountAlias = (id: number) => {
    let account = accounts.result[id];
    return account?.alias || account?.full_name;
  }

  return (
    <LedgerContext.Provider
      value={{
        initLoading: transactions.loading || accounts.loading || commodities.loading || ledgers.loading,
        ledger_id: ledgerId,
        transactions: transactions.result,
        ledgers: ledgers.result,
        accounts: accounts.result,
        commodities: commodities.result,
        getAccountAlias,
        changeLedgerId,
        update
      }}>
      {children}
    </LedgerContext.Provider>
  )
}
