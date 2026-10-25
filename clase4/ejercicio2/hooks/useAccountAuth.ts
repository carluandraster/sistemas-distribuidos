"use client";

import { useEffect, useState } from "react";

/**
 * Hook para iniciar sesión
 * 
 * @return Objeto con las siguientes propiedades:
 * - setUsername: callback para ingresar nombre de usuario
 * - setPassword: callback para ingresar contraseña
 * - submit: callback para enviar formulario
 * - error: mensaje de error en caso de haber ocurrido algo
 * @example const { setUsername, setPassword, submit, error } = useAccountAuth();
     return (
         <div>
             <h1>User Login</h1>
             <input
                 type="text"
                 placeholder="Username"
                 onChange={(e) => setUsername(e.target.value)}
             />
             <input
                 type="password"
                 placeholder="Password"
                 onChange={(e) => setPassword(e.target.value)}
             />
             <button onClick={submit}>Login</button>
             {error && <p>{error}</p>}
         </div>
     );
 */
export function useAccountAuth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [valid, setValid] = useState(false);

    /**
     * Manda usuario y contraseña al servidor
     */
    const submit = async () => {
        if (!valid) {
            setError("Please fill in both fields.");
        } else {
            await fetch("@/app/api/login", {
                method: "POST",
                headers: {
                    "username": username,
                    "password": password
                }
            }).then((response) => {
                if (!response.ok)
                    throw Error("La API falló")
            }).catch(e => {
                setError(e.message)
            });
        }
    };

    useEffect(() => {
        setValid(username != "" && password != "");
    }, [username, password]);

    return {
        setUsername,
        setPassword,
        submit,
        error
    }
}