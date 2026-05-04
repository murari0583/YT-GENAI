import axios from "axios";
import { apiUrl } from "../../../config/api";

const config = { withCredentials: true };

export async function register(username, email, password) {
    return axios.post(apiUrl('/api/auth/register'), { username, email, password }, config);
}

export async function login(username, password) {
    return axios.post(apiUrl('/api/auth/login'), { username, password }, config);
}

export async function logout() {
    return axios.post(apiUrl('/api/auth/logout'), {}, config);
}

export async function getMe() {
    return axios.get(apiUrl('/api/auth/me'), config);
}
