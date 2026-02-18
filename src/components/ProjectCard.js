export default function ProjectCard({ project }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            {project.image_url ? (
                <div className="w-full h-48 overflow-hidden bg-gray-100">
                    <img
                        src={project.image_url}
                        alt={project.project_name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">
                    📁
                </div>
            )}
            <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {project.project_name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-3">
                    {project.description || "No description provided."}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium">👥 {project.team_name}</span>
                    {project.members && (
                        <span className="opacity-70">{project.members}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
