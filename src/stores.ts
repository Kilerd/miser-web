import {writable} from 'svelte/store';
import type {Account, Commodity, Entry, Transaction} from './types';


export const directives = writable<{ [date: string]: Transaction[] }>({});


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
                innerAccount = accountsEntity[accountId]?.alias || accountsEntity[accountId]?.name;
            });
            return innerAccount;
        }
    }
})()

export const commodities = writable<{ [name: string]: Commodity }>({});

export const segment = writable<string | undefined>(undefined);
