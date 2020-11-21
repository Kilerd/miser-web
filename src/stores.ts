import {writable, derived} from 'svelte/store';
import type {Dated, Entry, JournalDirective} from './types';


export const count = writable<number>(1);
export const directives = writable<Dated<JournalDirective[]>[]>([]);
export const entries = writable<{ [id: string]: Entry }>({});
export const accounts = (() => {
    const {subscribe, set, update} = writable({});
    return {
        subscribe,
        set,
        update,
        getAlias: (account) => {
            subscribe((accountsEntity) => {
                console.log("update alias", accountsEntity);
                account =  (accountsEntity[account]?.notes || {})['alias'] || account;
            });
            return account;
        }
    }
})()
