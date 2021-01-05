import {derived, writable} from 'svelte/store';
import type {Account, Commodity, Entry, PeriodicBill, Transaction} from './types';
import {api} from "./http";

interface MapStoreItem<V> {
    [key: string]: V
}

function createMapStore<V>(initial: MapStoreItem<V>) {
    const store = writable(initial);
    const results = derived(store, s => ({
        keys: Object.keys(s),
        values: Object.values(s),
        entries: Object.entries(s),
        set(k: string, v: V) {
            store.update(s => Object.assign({}, s, {[k]: v}))
        },
        remove(k: string) {
            store.update(s => {
                delete s[k];
                return s;
            });
        },
        updateAll(value: MapStoreItem<V>) {
            store.update(() => value)
        }
    }));
    return {
        subscribe: results.subscribe,
        set: store.set,
        update: store.update
    }
}


export const directives = createMapStore<Transaction[]>({});


export const entries = writable<{ [id: string]: Entry }>({});

export const currentLedger = writable<string | undefined>(undefined);

export const accounts = (() => {
    const {subscribe, set, update} = writable<{ [id: number]: Account }>({});
    return {
        subscribe,
        set,
        update,
        getAlias: (accountId: number) => {
            let innerAccount = `${accountId}`;
            subscribe((accountsEntity) => {
                innerAccount = accountsEntity[accountId]?.alias || accountsEntity[accountId]?.full_name;
            });
            return innerAccount;
        },
        fetchLatest: async () => {
            let fetchedAccounts = (await api.getAccounts()).data.data;
            let a: { [id: number]: Account } = {};
            for (let it of fetchedAccounts) {
                a[it.id] = it;
            }
            update(n => a);
        }
    }
})()

export const commodities = (() => {
    const {subscribe, set, update} = writable<{ [name: string]: Commodity }>({});
    return {
        subscribe,
        set,
        update,
        fetchLatest: async () => {
            let fetchedCommodities = (await api.getCommodities()).data.data;
            let commoditiesMap: { [name: string]: Commodity } = {}
            for (let it of fetchedCommodities) {
                commoditiesMap[it.name] = it
            }
            update(() => {
                return commoditiesMap;
            })
        }
    }
})();

export const segment = writable<string | undefined>(undefined);

export const test = writable(1);

export const periodicBills = createMapStore<PeriodicBill>({
    "1": {
        id: 1,
        name: "Test Month Spent",
        description: undefined,
        periodic: "MONTH",
        amount: "1.00",
        commodity: "CNY",
    },
    "2": {
        id: 2,
        name: "Test Year Spent",
        description: " test year spent description",
        periodic: "YEAR",
        amount: "1000.00",
        commodity: "CNY",
    }
})


currentLedger.subscribe(async newLedgerId => {
    if (newLedgerId !== undefined) {
        // update account
        await accounts.fetchLatest();
        // update commodities
        await commodities.fetchLatest();
    }
})