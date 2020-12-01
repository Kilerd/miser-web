import axios, {AxiosInstance, AxiosPromise, AxiosResponse} from 'axios';
import type {JournalDirective} from './types';

const BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://miser.3min.work';

// const BASE_URL = "https://miser.3min.work"


export const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}`
}
export const deleteCookie = (name: string) => {
    if (existCookie(name)) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
}

export const existCookie = (name: string) => {
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}
export const getCookie = (cname: string) => {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}


export interface OkResponse<T> {
    data: T
}


export interface JournalResponse {
    [key: string] : JournalDirective[]
}


class API {
    axios: AxiosInstance;
    token: string;
    private currentLedgerId: string = undefined;
    private session: any;

    constructor() {

        this.axios = axios.create({
            baseURL: BASE_URL,
        });
        this.axios.interceptors.response.use(
            data => data,
            error => {
                if (error.response && error.response.status === 401) {
                    this.clearAuthenticateToken()
                }
                return Promise.reject(error);
            });
    }

    setAuthenticateToken(session, token: string | null) {
        this.session = session;
        if (token) {
            this.axios.defaults.headers.Authorization = `Bearer ${token}`;
        }
    }

    clearAuthenticateToken() {
        deleteCookie('AUTH');
        this.axios.defaults.headers.Authorization = null;
        this.session.token = undefined;
        this.session.authenticated = false;
    }

    async getUserInfo() {
        return await this.axios.request({
            method: 'get',
            url: '/user',
        })
    }

    async login(email: string, password: string) {
        return await this.axios.post(
            '/authorization',
            {email, password},
        )
    }

    async register(email: string, username: string, password: string) {
        return await this.axios.post(
            '/user',
            {
                email, username, password
            }
        )
    }

    async getJournal(): Promise<AxiosResponse<OkResponse<JournalResponse>>> {
        return await this.axios.get(
            `/ledgers/${this.currentLedgerId}/journals`,
        )
    }

    async getAccounts() {
        return await this.axios.get(`/ledgers/${this.currentLedgerId}/accounts`)
    }

    async getEntries() {
        return await this.axios.get('/ledgers')
    }

    async createTransaction(date, payee, narration, tags, links, lines) {
        return await this.axios.post(`/ledgers/${this.currentLedgerId}/transactions`, {
            date,
            payee,
            narration,
            tags,
            links,
            lines
        })
    }

    setCurrentLedgerId(currentLedgerId: string) {
        this.currentLedgerId = currentLedgerId;
    }

    async getCommodities() {
        return await this.axios.get(`/ledgers/${this.currentLedgerId}/commodities`)
    }
}

export const api = new API();