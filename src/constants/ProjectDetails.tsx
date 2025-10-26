import ProjectCard from "@/components/shared/ProjectCard";
import { useGetProjects } from "@/lib/react-query/queryandmutation";
import type { Models } from "appwrite";

export default function ProjectDetails() {
    const { data: projects, isPending: isProjectLoading } = useGetProjects();
    console.log(projects, 'data from project details');
    console.log(isProjectLoading, 'data from project details');

    return (
        <div>
            <ul className="flex flex-col flex-1 gap-4 w-full relative snap-x">
                {projects?.documents.map((project: Models.Document) => (
                    <li key={project.elderID} className="snap-center">
                        <ProjectCard project={project}></ProjectCard>
                    </li>
                ))}
            </ul>
          
        </div>
    )
}
