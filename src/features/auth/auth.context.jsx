import { createContext, useEffect, useState } from "react";
import * as authApi from "./services/auth.api";

export const AuthContext = createContext({
    user: null,
    loading: true,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bootstrapUser = async () => {
            try {
                const response = await authApi.getMe();
                setUser(response.data.user || null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrapUser();
    }, []);

    const login = async (username, password) => {
        const response = await authApi.login(username, password);
        setUser(response.data.user);
        return response;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
