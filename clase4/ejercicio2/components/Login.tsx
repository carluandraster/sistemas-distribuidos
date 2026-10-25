import { useAccountAuth } from "../hooks/useAccountAuth";
import { useRouter } from "next/navigation";

export default function Login() {
    const { setUsername, setPassword, submit, error } = useAccountAuth();
    const router = useRouter();

    async function handleSubmit() {
        await submit();
        if (!error) {
            router.push("/dashboard");
        }
    }

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
            <button onClick={handleSubmit}>Login</button>
            {error && <p>{error}</p>}
            <p>¿No tienes cuenta? <a href="../register">Crea una nueva cuenta</a></p>
        </div>
    );
}