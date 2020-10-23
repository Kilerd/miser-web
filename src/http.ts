import axios, { AxiosInstance } from "axios";
import { stores } from '@sapper/app';
const BASE_URL = process.env.NODE_ENV === "production"
    ? "https://miser.3min.work"
    : "http://localhost:8000";

// const BASE_URL = "https://miser.3min.work"

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
            { email, password },
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

}

export const api = new API();