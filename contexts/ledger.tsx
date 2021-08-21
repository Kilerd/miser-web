import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useAsync } from "react-async-hook";
import api from "../api";
import { useAuth } from "./auth";
import {
  Account,
  Commodity,
  IdMap,
  Ledger,
  NameMap,
  RESOURCE_TYPE,
  User,
} from "../types";
import LedgerSelector from "../components/LedgerSelector";
import { useRouter } from "next/router";
import LoadingPage from "../components/LoadingPage";

const VERSION = "0.0.2";

interface LedgerContextProps {
  ledger_id: string;
  ledgers: IdMap<Ledger>;
  accounts: IdMap<Account>;
  commodities: NameMap<Commodity>;

  getAccountAlias(id: number): string;

  changeLedgerId(id: string): void;

  update(type: RESOURCE_TYPE): void;
}

interface UserLocalData {
  user_id: number;
  selectedLedger?: {
    id: string;
  };
}

function initCurrentLedger(user: User | undefined): UserLocalData | null {
  const item = localStorage.getItem(`user_data_ledger_${user?.id}:${VERSION}`);
  if (item === null) {
    return null;
  }
  return JSON.parse(item);
}

function initContext(): LedgerContextProps {
  return {
    ledger_id: Cookies.get("CURRENT_LEDGER_ID"),
    // transactions: {}
  } as LedgerContextProps;
}

const LedgerContext = createContext(initContext());
export const useLedger = () => useContext(LedgerContext);

const UNAUTHENTICATED_ROUTE = ["/ledgers"];

export const LedgerProvider = ({ children }: any) => {
  const { user } = useAuth();
  const router = useRouter();
  const userLocalData = initCurrentLedger(user);
  api.setLedgerId(userLocalData?.selectedLedger?.id);

  const [ledgerId, setLedgerId] = useState(userLocalData?.selectedLedger?.id);
  const [ledgers, setLedgers] = useState({});

  const commodities = useAsync(
    async () => (ledgerId !== undefined ? api.loadCommodities() : {}),
    []
  );
  const accounts = useAsync(
    async () => (ledgerId !== undefined ? api.loadAccount() : {}),
    []
  );

  const changeLedgerId = (id: string) => {
    const userData: UserLocalData = {
      user_id: user.id,
      selectedLedger: {
        id,
      },
    };
    localStorage.setItem(
      `user_data_ledger_${user.id}:${VERSION}`,
      JSON.stringify(userData)
    );
    api.setLedgerId(id);
    setLedgerId(id);
    if (ledgers[ledgerId] !== undefined) {
      dayjs.tz.setDefault(ledgers[ledgerId].timezone);
    } else {
      dayjs.tz.setDefault();
    }
  };

  const loadAndSetLedgers = async () => {
    const data = await api.loadLedgers();
    setLedgers(data);
    if (ledgerId !== null && data[ledgerId] !== null) {
      dayjs.tz.setDefault(data[ledgerId]?.timezone);
    } else {
      dayjs.tz.setDefault();
    }
    return data;
  };
  useEffect(() => {
    commodities.execute();
    accounts.execute();
  }, [ledgerId]);

  useEffect(() => {
    (async () => {
      if (user !== undefined) {
        await loadAndSetLedgers();
        const initialState = initCurrentLedger(user);
        if (initialState !== null) {
          await changeLedgerId(initialState.selectedLedger.id.toString());
        }
      }
    })();
  }, [user]);

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
      default:
        break;
    }
  };

  const getAccountAlias = (id: number) => {
    const account = accounts.result[id];
    return account?.alias || account?.name;
  };
  if (accounts.result === undefined || commodities.result === undefined) {
    return <LoadingPage message="Loading ledger basic data..." />;
  }
  if (
    ledgerId === undefined &&
    user !== undefined &&
    !UNAUTHENTICATED_ROUTE.includes(router.asPath)
  ) {
    return <LedgerSelector selectLedger={changeLedgerId} ledgers={ledgers} />;
  }
  return (
    <LedgerContext.Provider
      value={{
        ledger_id: ledgerId,
        ledgers,
        accounts: accounts.result,
        commodities: commodities.result,
        getAccountAlias,
        changeLedgerId,
        update,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};
