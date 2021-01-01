export interface Dated<T> {
    date: string,
    content: T
}

export interface Entry {
    id: number;
    name: string,
    operating_commodity: string,
    accounts: Account[]
}

export interface Transaction {
    id: number,
    create_time: string,
    flag: string,
    payee?: string,
    narration?: string,
    tags: string[],
    links: string[],
    lines: TransactionLine[]
}

export interface TransactionLine {
    id: number,
    flag: string,
    account: number,
    amount?: string[],
    cost?: string[],
    description: string
}

export interface Account {
    id: number,
    name: string,
    alias?: string,
    full_name: string,
    ledger_id: number,
    status: string,
    commodities: string[]
}

export interface Commodity {
    name: string,
    is_deleted: boolean,
    last_price?: string,
    last_price_update_time?: string
}

export interface AccountTree {
    income: AccountTreeItem,
    expense: AccountTreeItem,
    equity: AccountTreeItem,
    assets: AccountTreeItem,
}

export interface AccountTreeItem {
    id?: number,
    name: string,
    fullName: string,
    alias?: string,
    isAvailable: boolean,
    commodities?: string[],
    children: { [name: string]: AccountTreeItem }
}
