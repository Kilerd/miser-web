import axios, {AxiosInstance, AxiosPromise, AxiosResponse} from 'axios';
import type {JournalDirective} from './types';

const BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://miser.3min.work';

// const BASE_URL = "https://miser.3min.work"


export const deleteCookie = (name: string) => {
    if (getCookie(name)) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
}

export const getCookie = (name: string) => {
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
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

    setAuthenticateToken(token: string | null) {
        if (token) {
            this.axios.defaults.headers.Authorization = `Bearer ${token}`;
        }
    }

    clearAuthenticateToken() {
        deleteCookie('AUTH');
        this.axios.defaults.headers.Authorization = null;
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
            '/entries/1/journals',
        )
    }

    async getAccounts() {
        return await this.axios.get('/entries/1/accounts')
    }

    async getEntries() {
        return await this.axios.get('/entries')
    }

    async createTransaction(date, payee, narration, tags, links, lines) {
        return await this.axios.post('/entries/1/transactions', {
            date,
            payee,
            narration,
            tags,
            links,
            lines
        })
    }
}

export const api = new API();