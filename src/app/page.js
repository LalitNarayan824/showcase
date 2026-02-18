"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="text-center py-10 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Project Showcase
        </h1>
        <p className="text-gray-500 text-lg">
          Discover amazing projects built by talented teams.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-3">📂</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No projects yet
          </h2>
          <p className="text-gray-500">
            Be the first to showcase your project! Register your team and add one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
