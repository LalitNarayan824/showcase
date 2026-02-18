"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
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
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-5">
            <div className="bg-white border border-gray-200 rounded-lg p-9 w-full max-w-md shadow-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Login</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Welcome back! Sign in to your team account.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-800 border border-red-300 rounded-md px-3.5 py-2.5 text-sm font-medium mb-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
