
{/* this is a previouse model we have 
  converted into shadcn form style
no use of this form keep it for reference 
only if any modification to be done then 
use login/page.jsx file and dont shout at
 me if wasted your time with this-   */}

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 md:p-8 rounded-lg shadow-md border-2 border-gray-200 bg-white space-y-5">
        <h1 className="text-xl sm:text-2xl font-bold text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            type="email"
            placeholder={`${errors.email ? errors.email.message : "Email"}`}
            className={`w-full border px-3 py-2 rounded text-sm sm:text-base
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
            className={`w-full border px-3 py-2 rounded text-sm sm:text-base
              ${
                errors.password
                  ? "border-red-600 placeholder-red-400"
                  : "border-gray-300 placeholder-gray-400"
              }`}
            {...register("password", { required: "Password is required" })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded text-sm sm:text-base hover:bg-blue-700"
          >
            Sign in with Email
          </button>
        </form>

        <div className="text-center text-xs sm:text-sm text-gray-500">OR</div>

        <button
          onClick={() => signIn("github")}
          className="w-full bg-gray-800 text-white py-2 rounded text-sm sm:text-base hover:bg-black"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
