// Centraliza todas las llamadas al backend relacionadas con autenticación.
// Así las páginas solo se ocupan de la interfaz.

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const buildUrl = (path) => `${BACKEND_URL}${BACKEND_URL.endsWith("/") ? "" : "/"}api${path}`;

export const signup = async (email, password) => {
    const response = await fetch(buildUrl("/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "No se pudo crear la cuenta");
    }
    return data;
};

export const login = async (email, password) => {
    const response = await fetch(buildUrl("/token"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "No se pudo iniciar sesión");
    }
    return data; 
};

export const getPrivateData = async (token) => {
    const response = await fetch(buildUrl("/private"), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
           
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.msg || "Token inválido o expirado");
    }
    return data;
};