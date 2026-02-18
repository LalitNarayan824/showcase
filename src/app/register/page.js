"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        teamName: "",
        email: "",
        password: "",
        members: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            window.location.href = "/dashboard";
        } catch {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-5 py-8">
            <div className="bg-white border border-gray-200 rounded-lg p-9 w-full max-w-md shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Register Your Team
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Create an account to showcase your projects.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-800 border border-red-300 rounded-md px-3.5 py-2.5 text-sm font-medium mb-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="teamName" className="text-sm font-medium text-gray-700">
                            Team Name
                        </label>
                        <input
                            id="teamName"
                            name="teamName"
                            type="text"
                            value={formData.teamName}
                            onChange={handleChange}
                            placeholder="Awesome Team"
                            required
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="team@example.com"
                            required
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="members" className="text-sm font-medium text-gray-700">
                            Team Members
                        </label>
                        <input
                            id="members"
                            name="members"
                            type="text"
                            value={formData.members}
                            onChange={handleChange}
                            placeholder="Alice, Bob, Charlie"
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500"
                        />
                        <small className="text-xs text-gray-400">Comma-separated names</small>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
