"use client";

import useAccountBuilder from "@/hooks/useAccountBuilder";
import { useRouter } from "next/navigation";

export default function SignIn() {
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