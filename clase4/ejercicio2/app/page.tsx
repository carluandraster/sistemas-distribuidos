"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Home() {
  const router = useRouter();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = schema.safeParse({
      name: formData.get("name"),
      password: formData.get("password"),
    });

    if (!result.success) {
      console.error(result.error.flatten());
      return;
    }

    fetch("/api/login", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  }

  return (
    <div>
      <h1>User Login</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <p>¿No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
}
