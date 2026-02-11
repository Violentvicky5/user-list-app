
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/BreadCrumb";

export default function AddUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inputStatus, setInputStatus] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!name || !email) {
      setInputStatus("error");
      setMessage("Please provide both name and email.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add user");

      setName("");
      setEmail("");
      setInputStatus("success");
      setMessage("User added successfully with ID: " + data.id);
    } catch (err) {
      setInputStatus("error");
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* Breadcrumb */}
      <Breadcrumb />

      <h2 className="text-xl font-semibold mb-4">Add User</h2>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setInputStatus(null);
              setMessage("");
            }}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              inputStatus === "error"
                ? "border border-red-500 focus:ring-red-400"
                : "border border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setInputStatus(null);
              setMessage("");
            }}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              inputStatus === "error"
                ? "border border-red-500 focus:ring-red-400"
                : "border border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
