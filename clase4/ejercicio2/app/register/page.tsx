"use client";

import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
});

export default function Home() {
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
      
    if (event.currentTarget.password.value !== event.currentTarget.confirmPassword.value) {
        console.error("Passwords do not match");
        return;
    }

    const formData = new FormData(event.currentTarget);

    const result = schema.safeParse({
      name: formData.get("name"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      console.error(result.error.flatten());
      return;
    }

    console.log(result.data);
  }

  return (
    <div>
      <h1>User Registration</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" />
        <input name="password" type="password" placeholder="Password" />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
