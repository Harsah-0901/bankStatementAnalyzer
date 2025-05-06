import React, { useState } from "react";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const res = await api.post("/register", form);
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-start w-full">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 h-[65vh] flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <div className="mb-4">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            name="first_name"
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            name="last_name"
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

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
          onClick={handleRegister}
          className="w-1/2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition duration-200"
        >
          Register
        </button>
      </div>
    </div>
  );
}
