import { useState } from "react";

export const RecoverRequest = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const sendRequest = async (e) => {
        e.preventDefault();

        setStatus("");
        setError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/recover/request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            if (!response.ok) {
                throw new Error("Error en el servidor");
            }

            setStatus("Si el correo existe, recibirás un email en unos minutos.");
        } catch (err) {
            console.error("ERROR:", err);
            setError("Hubo un problema enviando el correo. Intenta más tarde.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Recuperar contraseña</h2>

            <form onSubmit={sendRequest}>
                <label className="form-label">Correo electrónico</label>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button className="btn btn-primary w-100" type="submit">
                    Enviar instrucciones
                </button>
            </form>

            {status && <p className="text-success text-center mt-3">{status}</p>}
            {error && <p className="text-danger text-center mt-3">{error}</p>}
        </div>
    );
};
