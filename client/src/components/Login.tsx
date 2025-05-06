import React, { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end w-full ">
      <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-md p-8  flex flex-col items-center justify-center h-[65vh]">
        <h2 className="text-2xl font-bold mb-8">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-1/2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
}
