import { useState } from "react";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);

    // 1. Obtener token desde la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // Si no hay token, no debería continuar
    if (!token) {
        return (
            <div className="container mt-5 text-center">
                <h3>Token inválido o expirado.</h3>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/recover/reset`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setStatus("Contraseña actualizada correctamente. Serás redirigido al login.");
                
                // redirigir a login después de 2s
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setStatus(data.msg || "Error al actualizar contraseña.");
            }
        } catch (error) {
            setStatus("Error en el servidor.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Restablecer contraseña</h2>

            {!success && (
                <form onSubmit={handleSubmit}>
                    <label className="form-label">Nueva contraseña</label>
                    <input
                        type="password"
                        className="form-control mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        required
                    />

                    <button className="btn btn-success w-100" type="submit">
                        Guardar nueva contraseña
                    </button>
                </form>
            )}

            {status && (
                <p className={`text-center mt-3 ${success ? "text-success" : "text-danger"}`}>
                    {status}
                </p>
            )}
        </div>
    );
};
