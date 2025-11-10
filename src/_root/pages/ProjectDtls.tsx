import { useParams } from "react-router-dom"

function ProjectDtls() {
    const { id } = useParams();
    return (
        <div className="bg-red-400 h-screen w-full flex">
            <h1>{id}</h1>
        </div>
    )
}

export default ProjectDtls
