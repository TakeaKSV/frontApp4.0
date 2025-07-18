import { useAuth } from "../../auth/authProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Logon() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handlerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("https://backapp40-production.up.railway.app/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }),
            });

            if (!response.ok) throw new Error("Credenciales incorrectas");

            const data = await response.json();
            login(data.accessToken, data.user || { email });
            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            console.error("Error during login:", err);
            setError(err.message || "Error al iniciar sesión");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Iniciar Sesión</h2>
            <form onSubmit={handlerSubmit} style={styles.form}>
                {error && <p style={styles.error}>{error}</p>}

                <label style={styles.label}>Correo electrónico</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    style={styles.input}
                />

                <label style={styles.label}>Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>Iniciar Sesión</button>
            </form>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: "400px",
        margin: "100px auto",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        textAlign: "center",
        marginBottom: "1.5rem",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: "0.5rem",
        fontWeight: "bold",
        color: "#555",
    },
    input: {
        padding: "10px",
        marginBottom: "1rem",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    button: {
        padding: "12px",
        borderRadius: "5px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background 0.3s ease",
    },
    error: {
        color: "red",
        marginBottom: "1rem",
        textAlign: "center",
    },
};
