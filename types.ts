import Big from 'big.js';
export interface IdMap<DATA> {
  [id: number]: DATA
}

export interface NameMap<DATA> {
  [name: string]: DATA
}

export interface AccountListItemType {
  name: string,
  fullName: string,
  isAvailable: boolean,
  alias?: string,
  commodities: string[],
  amount: Big,
  id?: number,
  icon?: string,
  children: { [name: string]: AccountListItemType }
}


export type AccountStatus = "Open"
export type AccountBalance = [number, string]

export interface AccountDailyStatic {
  amount: string,
  change: string,
  balances: AccountBalance[]
}

export interface Account {
  id: number,
  name: string,
  alias?: string,
  full_name: string,
  ledger_id: number,
  status: AccountStatus,
  commodities: string[],
  amount: string,
  daily: { [date: string]: AccountDailyStatic }
}


export interface Commodity {
  id: number,
  name: string,
  is_deleted: boolean,
  last_price?: string,
  last_price_update_time?: string
}

export interface User {
  id: number,
  username: string,
  email: string,
  avatar: string,
  ledgers: string[]
}

export interface Ledger {
  id: number,
  name: string,
  operating_commodity: string,
}


export interface Transaction {
  id: number,
  create_time: string,
  flag: string,
  has_document: boolean,
  is_balance: boolean,
  links: string[],
  tags: string[],
  narration: string,
  payee: string,
  lines: {
    id: number,
    flag: string,
    account: number,
    cost: [string, string]
  }[]
}

export type RESOURCE_TYPE = "TRANSACTIONS" | "ACCOUNT" | "COMMODITY";
