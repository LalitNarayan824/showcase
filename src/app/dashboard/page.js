"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [team, setTeam] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const meRes = await fetch("/api/auth/me");
            const meData = await meRes.json();

            if (!meData.team) {
                router.push("/login");
                return;
            }

            setTeam(meData.team);

            const projRes = await fetch("/api/projects");
            const projData = await projRes.json();

            const myProjects = projData.projects.filter(
                (p) => p.team_id === meData.team.id
            );
            setProjects(myProjects);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("projectName", projectName);
            formData.append("description", description);
            if (image) {
                formData.append("image", image);
            }

            const res = await fetch("/api/projects", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to add project");
                setSubmitting(false);
                return;
            }

            setSuccess("Project added successfully!");
            setProjectName("");
            setDescription("");
            setImage(null);
            setSubmitting(false);
            fetchData();
        } catch {
            setError("Something went wrong");
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
                <p className="text-gray-500">
                    Welcome, <strong>{team?.teamName}</strong>!
                </p>
            </div>

            {/* Add Project Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Add New Project
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-800 border border-red-300 rounded-md px-3.5 py-2.5 text-sm font-medium mb-3">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-800 border border-green-300 rounded-md px-3.5 py-2.5 text-sm font-medium mb-3">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="My Awesome Project"
                            required
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your project..."
                            rows={4}
                            className="px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-900 outline-none focus:border-indigo-500 font-[inherit]"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="image" className="text-sm font-medium text-gray-700">
                            Project Image
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="self-start bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        disabled={submitting}
                    >
                        {submitting ? "Adding..." : "Add Project"}
                    </button>
                </form>
            </div>

            {/* My Projects */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Projects ({projects.length})
                </h2>

                {projects.length === 0 ? (
                    <p className="text-gray-500 py-4">
                        You haven&apos;t added any projects yet. Use the form above to add one!
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center gap-4 p-3 border border-gray-200 rounded-md bg-gray-50"
                            >
                                {project.image_url && (
                                    <img
                                        src={project.image_url}
                                        alt={project.project_name}
                                        className="w-15 h-15 rounded-md object-cover shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
                                        {project.project_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                        {project.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="text-xs font-medium text-white bg-red-500 px-3 py-1.5 rounded-md hover:bg-red-600 cursor-pointer shrink-0"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
