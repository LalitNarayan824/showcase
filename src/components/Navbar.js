"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                setTeam(data.team);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setTeam(null);
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-5 h-15 flex items-center justify-between">
                <Link href="/" className="text-lg font-bold text-gray-900 no-underline">
                    🚀 Project Showcase
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 no-underline">
                        Home
                    </Link>

                    {loading ? null : team ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 no-underline">
                                Dashboard
                            </Link>
                            {team.isAdmin && (
                                <Link href="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 no-underline">
                                    Admin
                                </Link>
                            )}
                            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                                {team.teamName}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3.5 py-1.5 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 no-underline">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 no-underline"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
