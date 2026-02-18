"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [teams, setTeams] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("projects");
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const meRes = await fetch("/api/auth/me");
            const meData = await meRes.json();

            if (!meData.team || !meData.team.isAdmin) {
                router.push("/");
                return;
            }

            const [projRes, teamRes] = await Promise.all([
                fetch("/api/admin/projects"),
                fetch("/api/admin/teams"),
            ]);

            const projData = await projRes.json();
            const teamData = await teamRes.json();

            setProjects(projData.projects || []);
            setTeams(teamData.teams || []);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm("Delete this project?")) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            }
        } catch {
            alert("Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-5 py-8">
                <p className="text-gray-500 text-center py-10">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-5 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Admin Dashboard
                </h1>
                <p className="text-gray-500">Manage all teams and projects.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
                <button
                    className={`px-5 py-2 border rounded-md text-sm font-medium cursor-pointer transition-colors ${activeTab === "projects"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                    onClick={() => setActiveTab("projects")}
                >
                    Projects ({projects.length})
                </button>
                <button
                    className={`px-5 py-2 border rounded-md text-sm font-medium cursor-pointer transition-colors ${activeTab === "teams"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                    onClick={() => setActiveTab("teams")}
                >
                    Teams ({teams.length})
                </button>
            </div>

            {/* Projects Tab */}
            {activeTab === "projects" && (
                <div className="bg-white border border-gray-200 rounded-lg p-5 overflow-x-auto">
                    {projects.length === 0 ? (
                        <p className="text-gray-500 py-4">No projects yet.</p>
                    ) : (
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Project
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Team
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Description
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Date
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p) => (
                                    <tr key={p.id}>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {p.project_name}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {p.team_name}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100 max-w-[200px] truncate">
                                            {p.description?.slice(0, 80)}
                                            {p.description?.length > 80 ? "..." : ""}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            <button
                                                onClick={() => handleDeleteProject(p.id)}
                                                className="text-xs font-medium text-white bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Teams Tab */}
            {activeTab === "teams" && (
                <div className="bg-white border border-gray-200 rounded-lg p-5 overflow-x-auto">
                    {teams.length === 0 ? (
                        <p className="text-gray-500 py-4">No teams registered.</p>
                    ) : (
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Team Name
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Email
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Members
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Admin
                                    </th>
                                    <th className="text-left p-2.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((t) => (
                                    <tr key={t.id}>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {t.team_name}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {t.email}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {t.members || "—"}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {t.is_admin ? "✅" : "—"}
                                        </td>
                                        <td className="p-2.5 border-b border-gray-100">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
