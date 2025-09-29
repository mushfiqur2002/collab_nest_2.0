import type { Models } from "appwrite";

type ProjectCardProps = {
    project: Models.Document;
};

export default function ProjectCard({ project }: ProjectCardProps) {
    console.log(project);

    return (
        <div className="p-6 rounded-xl shadow-md bg-dark-3 border border-dark-4 hover:shadow-lg transition">
            {/* Project Title */}
            <h1 className="text-xl font-semibold text-white mb-2 capitalize">
                {project.projectName}
            </h1>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4">
                {project.projectDescription}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
                <label className="text-xs text-gray-400 mb-1 block">Progress</label>
                <input
                    type="range"
                    className="w-full accent-indigo-500"
                    min="0"
                    max="100"
                    defaultValue="40"
                    disabled
                />
            </div>

            {/* Members */}
            <div>
                <h2 className="text-sm font-medium text-gray-200 mb-2">Members</h2>
                <div className="flex -space-x-3">
                    {project.members?.slice(0, 5).map((m: string, index: number) => (
                        <img
                            key={index}
                            src="/default-avatar.png"
                            alt="member"
                            className="w-8 h-8 rounded-full border-2 border-dark-3 object-cover"
                        />
                    ))}
                    {project.members?.length > 5 && (
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                            +{project.members.length - 5}
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}
