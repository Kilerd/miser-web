import {writable} from 'svelte/store';
import type {Dated, Entry, JournalDirective} from './types';


export const count = writable<number>(1);
export const directives = writable<Dated<JournalDirective[]>[]>([]);
export const entries = writable<{ [id: string]: Entry }>({});