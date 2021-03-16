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
  amount: string,
  id?: number,
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

export type RESOURCE_TYPE = "TRANSACTIONS" | "ACCOUNT" | "COMMODITY";
