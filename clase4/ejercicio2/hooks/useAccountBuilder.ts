"use client";

import { useEffect, useState } from "react";

/**
 * Hook para registrar cuenta
 * 
 * @return Objeto con las siguientes propiedades:
 * - setUsername: callback para ingresar nombre de usuario
 * - setPassword: callback para ingresar contraseña
 * - setPassRepeated: callback para ingresar contraseña repetida
 * - submit: callback para enviar formulario
 * - error: mensaje de error en caso de haber ocurrido algo
 * @example export default function SignIn() {
                const { setUsername, setPassword, setPassRepeated, submit, error } = useAccountBuilder();
                const router = useRouter();
     
                async function handleSubmit() {
                    await submit();
                    if (!error) {
                        router.push("/dashboard");
                    }
                }
     
                return (
                    <div>
                        <h1>User Registration</h1>
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
                        <input
                            type="password"
                            placeholder="Repeat Password"
                            onChange={(e) => setPassRepeated(e.target.value)}
                        />
                        <button onClick={handleSubmit}>Sign In</button>
                        {error && <p>{error}</p>}
                        <p>¿Ya tienes cuenta? <a href="..">Inicia sesion</a></p>
                    </div>
                );
            }
 */
export default function useAccountBuilder() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeated, setPassRepeated] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [valid, setValid] = useState(false);

    /**
     * Manda usuario y contraseña al servidor
     */
    const submit = async () => {
        if (!valid) {
            setError("Please fill in both fields and make sure that both password are same.");
        } else {
            await fetch("@/app/api/sign_in", {
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
        setValid(username != "" && password != "" && password === passwordRepeated);
    }, [username, password, passwordRepeated]);

    return {
        setUsername,
        setPassword, setPassRepeated,
        submit,
        error
    }
}