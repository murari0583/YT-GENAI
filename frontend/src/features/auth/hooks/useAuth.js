import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const { user, login, logout } = useContext(AuthContext);

    const handleLogin = async (username, password) => {
        try {
            return await login(username, password);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            return await logout();
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return { user, login: handleLogin, logout: handleLogout };
};