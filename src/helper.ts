import dayjs from 'dayjs';
import type {Writable} from 'svelte/store';
import type {Account, AccountTree, AccountTreeItem} from './types';

export const isToday = (date: string): boolean => {
    const today = dayjs().format('YYYY-MM-DD');
    return today === date;
}

export function subscriptStore<S, T>(store: Writable<S>, initValue: T, updatedStore: (newStore: S) => T) {
    let init = initValue;
    store.subscribe(newStoreValue => {
        init = updatedStore(newStoreValue);
    })
    return init;
}


export function accountTreeGenerator(value: { [id: number]: Account }) {
    let ret: AccountTree = {
        liabilities: {
            name: 'Liabilities',
            fullName: 'Liabilities',
            isAvailable: false,
            amount: "0",
            children: {}
        },
        assets: {
            name: 'Assets',
            fullName: 'Assets',
            isAvailable: false,
            amount: "0",
            children: {}
        }, equity: {
            name: 'Equity',
            fullName: 'Equity',
            isAvailable: false,
            amount: "0",
            children: {}
        }, expenses: {
            name: 'Expenses',
            fullName: 'Expenses',
            isAvailable: false,
            amount: "0",
            children: {}
        }, income: {
            name: 'Income',
            fullName: 'Income',
            isAvailable: false,
            amount: "0",
            children: {}
        }
    };
    Object.values(value).forEach(it => {
        let strings = it.full_name.split(':');
        let accountType = strings[0].toLocaleLowerCase();
        let targetCategory: AccountTreeItem = ret[accountType];
        for (let i = 1; i < strings.length - 1; i++) {
            let item = strings[i];
            if (!(item in targetCategory.children)) {
                targetCategory.children[item] = {
                    name: item,
                    fullName: strings.slice(0, i + 1).join(':'),
                    isAvailable: false,
                    amount: "0",
                    children: {}
                }
            }
            targetCategory = targetCategory.children[item];
        }
        let leafItem = strings[strings.length - 1];
        targetCategory.children[leafItem] = {
            name: leafItem,
            fullName: it.full_name,
            isAvailable: true,
            alias: it.alias,
            commodities: it.commodities,
            amount: it.amount,
            id: it.id,
            children: {}
        }
    })
    return ret;
}
