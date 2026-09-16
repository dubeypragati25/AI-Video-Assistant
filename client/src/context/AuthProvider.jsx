import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
            } catch {
                sessionStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        sessionStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password
        });

        sessionStorage.setItem("token", response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;