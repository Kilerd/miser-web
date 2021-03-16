import Axios, {AxiosInstance} from 'axios'
import dayjs from "dayjs";
import {Commodity, IdMap, NameMap} from "./types";

const urls = {
  development: "http://localhost:8000",
  production: "https://miser.3min.work/api"
}


class Api {

  private currentLedgerId: string
  client: AxiosInstance;

  constructor(currentLdgerId: string) {
    this.client = Axios.create({
      baseURL: urls[process.env.NODE_ENV],
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  setLedgerId(id: string) {
    this.currentLedgerId = id;
  }

  async updateCommodity(id: number, name: string) {
    // this.api.post
  }

  async newCommodity(name: string) {
    const {data: res} = await this.client.post(`/ledgers/${this.currentLedgerId}/commodities`, {name})
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

  async loadTransactions() {
    const {data: trxRes} = await this.client.get(`/ledgers/${this.currentLedgerId}/journals`);
    const transactions = trxRes.data;

    let trxMap: { [id: number]: any } = {}
    for (let transaction of transactions) {
      trxMap[transaction.id] = transaction;
    }
    return trxMap;
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
    return (await this.client.get("/user")).data.data
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

  async loadTransactionsByAccounts(id: string | string[]) {
    // todo
    return this.loadTransactions();
  }
}

const api = new Api(null);

export default api;


