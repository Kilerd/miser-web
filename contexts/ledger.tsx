import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import Cookies from 'js-cookie'
import dayjs from "dayjs";
import api from "../api";
import {useAuth} from "./auth";
import {Account, Commodity, IdMap, Ledger, NameMap, RESOURCE_TYPE, User} from "../types"
import {useAsync} from "react-async-hook";
import LedgerSelector from '../components/LedgerSelector'

interface LedgerContext {
    ledger_id: string,
    // transactions: IdMap<any>,
    ledgers: IdMap<Ledger>,
    accounts: IdMap<Account>,
    commodities: NameMap<Commodity>

    getAccountAlias(id: number): string,

    changeLedgerId(id: string): void,

    update(type: RESOURCE_TYPE): void;

    // loadMoreTransaction(): void;
}

interface UserLocalData {
    user_id: number,
    selectedLedger?: {
        id: number,
    },

}

function initCurrentLedger(user: User | undefined): UserLocalData | null {

    const item = localStorage.getItem(`user_data_${user.id}`);
    if (item === null) {
        return null;
    }
    return JSON.parse(item);
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

    const [ledgerId, setLedgerId] = useState(null);
    const [ledgers, setLedgers] = useState({});

    const commodities = useAsync(async () => ledgerId !== null ? api.loadCommodities() : {}, [ledgerId]);
    const accounts = useAsync(async () => ledgerId !== null ? api.loadAccount() : {}, [ledgerId]);

    const changeLedgerId = (id: string) => {
        const userData: UserLocalData = {
            user_id: user.id, selectedLedger: {
                id: parseInt(id, 10),
                // name: ledgers[id].name
            }
        }
        localStorage.setItem(`user_data_${user.id}`, JSON.stringify(userData))
        api.setLedgerId(id);
        setLedgerId(id);
        if (ledgers[ledgerId] !== undefined) {
            dayjs.tz.setDefault(ledgers[ledgerId].timezone);
        } else {
            dayjs.tz.setDefault()
        }
        // transactionsR.execute();

    }

    const loadAndSetledgers = async () => {
        let data = await api.loadLedgers();
        setLedgers(data);
        if (ledgerId !== null && data[ledgerId] !== null) {
            dayjs.tz.setDefault(data[ledgerId].timezone);
        } else {
            dayjs.tz.setDefault()
        }
        return data;
    };
    useEffect(() => {
        commodities.execute();
        accounts.execute();
    }, [ledgerId])

    useEffect(() => {
        (async () => {
            console.log("trigger by useeffect user change", ledgerId, ledgers, user)
            if (user !== undefined) {
                await loadAndSetledgers()
                const initialState = initCurrentLedger(user);
                if (initialState !== null) {
                    await changeLedgerId(initialState.selectedLedger.id.toString());
                }

            }
        })()
    }, [user])

    // const transactionsR = useAsync(async () => {
    //   const res = ledgerId !== undefined ? await api.loadTransactions(null) : {};
    //   setTransactions(res);
    // }, [ledgerId]);


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


    const getAccountAlias = (id: number) => {
        let account = accounts.result[id];
        return account?.alias || account?.name;
    }
    if (accounts.loading || commodities.loading || ledgers.loading) {
        return <div>ledger loading</div>
    }
    if (ledgerId === null && user !== undefined) {
        return <LedgerSelector selectLedger={changeLedgerId} ledgers={ledgers}/>
    }

    return (
        <LedgerContext.Provider
            value={{
                ledger_id: ledgerId,
                ledgers: ledgers,
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
