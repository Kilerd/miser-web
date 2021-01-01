import dayjs from 'dayjs';
import type {Writable} from 'svelte/store';

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
