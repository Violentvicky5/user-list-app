"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.ok) {
      window.location.href = "/dashboard/home";
      return;
    }

    if (result?.error) {
      setError("email", { type: "manual", message: "Invalid credentials" });
      setError("password", { type: "manual" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 rounded-lg shadow-md w-80 border-2 border-gray-200 bg-white space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            type="email"
            placeholder={`${errors.email ? errors.email.message : "Email"}`}
            className={`w-full border px-3 py-2 rounded  
                 ${
                   errors.email
                     ? "border-red-600 placeholder-red-400"
                     : "border-gray-300 placeholder-gray-400"
                 }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address",
              },
            })}
          />

          <input
            type="password"
            placeholder={`${
              errors.password ? errors.password.message : "Password"
            }`}
            className={`w-full border px-3 py-2 rounded  ${
              errors.password
                ? "border-red-600 placeholder-red-400"
                : "border-gray-300 placeholder-gray-400"
            }
`}
            {...register("password", { required: "Password is required" })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign in with Email
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">OR</div>

        <button
          onClick={() => signIn("github")}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-black"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
