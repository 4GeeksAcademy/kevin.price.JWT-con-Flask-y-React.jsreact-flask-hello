import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getPrivateData } from "../services/authService";

export const Private = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const [data, setData] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const validate = async () => {
            const token = store.token || sessionStorage.getItem("token");

          
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                
                const response = await getPrivateData(token);
                setData(response);
            } catch (err) {
                
                dispatch({ type: "logout" });
                navigate("/login");
            } finally {
                setChecking(false);
            }
        };

        validate();
    }, []);

    if (checking) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">Zona privada</h1>
                    <p className="lead">{data.message}</p>
                    <hr />
                    <p className="mb-1"><strong>ID:</strong> {data.user.id}</p>
                    <p className="mb-0"><strong>Email:</strong> {data.user.email}</p>
                </div>
            </div>
            <p className="text-muted mt-3">
                Solo puedes ver esto porque tu token es válido. Si lo borras del
                sessionStorage y refrescas, volverás al login.
            </p>
        </div>
    );
};