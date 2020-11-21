
export type Account = string;

export interface Dated<T> {
    date: string,
    content: T
}

export interface JournalDirective {
    type: 'Transaction' | 'Other',
    raw: Directive,
    from: Account[],
    to: Account[]
}


export interface Transaction {
    type: 'Transaction',
    date: string,
    flag: string,
    payee?: string,
    narration?: string,
    tags: string[],
    links: string[],
    lines: TransactionLine[]
}

export interface TransactionLine {
    flag: string,
    account: Account,
    amount?: string[],
    cost?: string[],
    single_price?: string,
    total_price?: string
}


export interface Other {
    type: 'Other'
}

export interface Entry {
    id: string,
    name: string,
    config: { [key: string]: string },
    accounts: Account[]
}

export type Directive = Transaction | Other
