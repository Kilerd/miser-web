import Axios, {AxiosInstance} from 'axios'
import {Commodity, NameMap} from "./types";
import Cookies from 'js-cookie'

const urls = {
    development: {
        scheme: "http",
        url: "192.168.10.100:8000",
        domain: "192.168.10.100:8000"
    },
    production: {
        scheme: "https",
        url: "api.miser.3min.work",
        domain: "miser.3min.work"
    }
}

export const BASE_ENV = urls[process.env.NODE_ENV];
export const BASE_URL = `${BASE_ENV.scheme}://${BASE_ENV.url}`;

class Api {

    private currentLedgerId: string
    public client: AxiosInstance;

    constructor(currentLdgerId: string) {
        this.client = Axios.create({
            baseURL: BASE_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    setLedgerId(id: number) {
        this.currentLedgerId = id.toString();
    }

    async updateCommodity(id: number, name: string) {
        // this.api.post
    }

    async newCommodity(name: string, description: string, precision: string, prefix: string, postfix: string) {
        const {data: res} = await this.client.post(`/ledgers/${this.currentLedgerId}/commodities`,
            {
                name,
                description,
                precision: parseInt(precision),
                prefix,
                postfix,
            })
        return res.data;
    }


    async loadLedgers() {
        const {data: res} = await this.client.get(`/ledgers`);
        const data = res.data;
        let ledger_map: { [id: string]: any } = {}
        for (let it of data) {
            ledger_map[it.id] = it;
        }
        return ledger_map;
    }

    async loadTransactions(createTime: Date | null) {
        const {data: trxRes} = await this.client.get(`/ledgers/${this.currentLedgerId}/journals`, {
            params: {"create_time": createTime || new Date()}
        });
        const transactions = trxRes.data;

        let trxMap: { [id: number]: any } = {}
        for (let transaction of transactions) {
            trxMap[transaction.id] = transaction;
        }
        return trxMap;
    }

    async newLedger(name: string, default_operating_commodity: string) {
        const axiosResponse = await this.client.post("/ledgers", {name, default_operating_commodity});
        return axiosResponse.data.data;
    }

    async loadAccount() {
        const {data: accountRes} = await this.client.get(`/ledgers/${this.currentLedgerId}/accounts`);
        const accountsData = accountRes.data;
        let accountMap: { [key: string]: any } = {}
        for (let it of accountsData) {
            accountMap[it.id] = it;
        }
        return accountMap;
    }

    async loadCommodities(): Promise<NameMap<Commodity>> {
        const {data: res} = await this.client.get(`/ledgers/${this.currentLedgerId}/commodities`);
        const data = res.data;
        let commodities_map: { [name: string]: Commodity } = {}
        for (let it of data) {
            commodities_map[it.name] = it;
        }
        return commodities_map
    }

    async getUserInfo() {
        const newVar = await get("/user");
        return newVar
    }

    async login(email, password) {
        const res = await this.client.post('/authorization', {email, password});
        return res.data.data;
    }

    async register(email, username, password) {
        const res = await this.client.post('/user', {email, username, password})
        return res.data.data;
    }


    async createTransaction(date: Date, payee: string, narration: string, tags: string[], links: string[], lines: any[]) {
        return await this.client.post(`/ledgers/${this.currentLedgerId}/transactions`, {
            date,
            payee,
            narration,
            tags,
            links,
            lines
        })
    }

    async updateTransaction(id: number, date: Date, payee: string, narration: string, tags: string[], links: string[], lines: any[]) {
        return await this.client.put(`/ledgers/${this.currentLedgerId}/transactions/${id}`, {
            date,
            payee,
            narration,
            tags,
            links,
            lines
        })
    }

    async deleteTransaction(id: number) {
        return await this.client.delete(`/ledgers/${this.currentLedgerId}/transactions/${id}`)
    }

    async newAccount(name: string, alias: string, selectedCommodityMap: string[], init: boolean, account: number, amount: string, commodity: string) {
        const accountType = name.split(':')[0];
        let data = {
            account_type: accountType,
            full_name: name,
            alias: alias === '' ? null : alias,
            commodities: selectedCommodityMap,
            init: {
                pad: account,
                amount,
                commodity
            }
        };
        if (!init) {
            data.init = null
        }
        return await this.client.post(`/ledgers/${this.currentLedgerId}/accounts`, data)
    }

    async updateAccount(id: number, name: string, alias: string, commodities: string[]) {
        return await this.client.put(`/ledgers/${this.currentLedgerId}/accounts/${id}`, {
            account_type: "Expenses",
            full_name: name,
            alias,
            commodities
        })
    }

    async getDocuments(transactionId: number) {
        return await this.client.get(`/ledgers/${this.currentLedgerId}/transactions/${transactionId}/documents`)
    }

    async uploadDocument(id, acceptedFiles: any) {
        let formData = new FormData();
        formData.append("data", acceptedFiles[0]);
        return await this.client.post(`/ledgers/${this.currentLedgerId}/transactions/${id}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    async loadTransactionsByAccounts(id: string | string[], createTime: Date | null) {
        const {data: trxRes} = await this.client.get(`/ledgers/${this.currentLedgerId}/accounts/${id}/journals`, {
            params: {"create_time": createTime || new Date()}
        });
        const transactions = trxRes.data;

        let trxMap: { [id: number]: any } = {}
        for (let transaction of transactions) {
            trxMap[transaction.id] = transaction;
        }
        return trxMap;
    }

    async newAccountBalance(id: string, date: Date, padAccount: unknown, amount: string, commodity: string) {
        return await this.client.post(`/ledgers/${this.currentLedgerId}/accounts/${id}/balance`, {
            time: date,
            account: padAccount,
            amount,
            commodity
        })
    }

    async getTokens() {
        return await this.client.get(`/tokens`)
    }

    async deleteToken(id: string) {
        return await this.client.delete(`/tokens/${id}`)
    }

    async newToken(description: string) {
        const axiosResponse = await this.client.post(`/tokens`, {
            description
        });
        return axiosResponse.data.data
    }

    async getSchedulerSummaries() {
        const axiosResponse = await this.client.get(`/ledgers/${this.currentLedgerId}/schedulers`);
        return axiosResponse.data.data
    }

    async deactivateSchedulerTask(id: string) {
        const axiosResponse = await this.client.patch(`/ledgers/${this.currentLedgerId}/schedulers/${id}:deactivate`);
        return axiosResponse.data.data
    }

    async activateSchedulerTask(id: string) {
        const axiosResponse = await this.client.patch(`/ledgers/${this.currentLedgerId}/schedulers/${id}:activate`);
        return axiosResponse.data.data
    }

    async createNewSchedulerTask(param: { payee: string; end_flag: number; schedule_rule: string; narration: string; name: string; description: string; links: any[]; lines: { amount: (string | null)[]; account: null }[]; tags: any[] }) {
        const axiosResponse = await this.client.post(`/ledgers/${this.currentLedgerId}/schedulers`, param);
        return axiosResponse.data.data
    }

    async github_auth(code: string | string[], state: string | string[]) {
        return await this.client.get("/oauth/github/callback", {
            params: {
                code: code, state: state
            }
        })
    }


}

const api = new Api(null);

export default api;


export const getToIdMap = async (url) => {
    const axiosResponse = await api.client.get(url);
    let res = axiosResponse.data.data;
    let idMap: { [id: number]: any } = {}
    for (let item of res) {
        idMap[item.id] = item;
    }
    return idMap;
}

export const get = async (url) => {
    try {
        const axiosResponse = await api.client.get(url);
        return axiosResponse.data.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                Cookies.remove('token');
                window.location.pathname = '/';
            }
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }


}
