import axios, {AxiosInstance} from "axios";

const BASE_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://miser.3min.work";

// const BASE_URL = "https://miser.3min.work"


export const delete_cookie = (name: string) => {
    if (get_cookie(name)) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

export const get_cookie = (name: string) => {
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
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
            this.axios.defaults.headers["Authorization"] = `Bearer ${token}`;
        }
    }

    clearAuthenticateToken() {
        delete_cookie("AUTH");
        this.axios.defaults.headers["Authorization"] = null;
    }

    async getUserInfo() {
        return await this.axios.request({
            method: "get",
            url: "/user",
        })
    }

    async login(email: string, password: string) {
        return await this.axios.post(
            "/authorization",
            {email, password},
        )
    }

    async register(email: string, username: string, password: string) {
        return await this.axios.post(
            "/user",
            {
                email, username, password
            }
        )
    }

    async getJournal() {
        return await this.axios.get(
            "/entries/demo/journals",
        )
    }

    async getAccounts() {
        return await this.axios.get("/entries/demo/accounts")
    }

    async getEntries() {
        return await this.axios.get("/entries")
    }

    async createTransaction(date, payee, narration, tags, links, lines) {
        return await this.axios.post("/entries/demo/transactions", {
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