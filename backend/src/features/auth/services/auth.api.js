import axios from "axios";

const config = { withCredentials: true };

export async function register(username, email, password) {
    return axios.post('http://localhost:3000/api/auth/register', { username, email, password }, config);
}

export async function login(username, password) {
    return axios.post('http://localhost:3000/api/auth/login', { username, password }, config);
}

export async function logout() {
    return axios.post('http://localhost:3000/api/auth/logout', {}, config);
}

export async function getMe() {
    return axios.get('http://localhost:3000/api/auth/me', config);
}
