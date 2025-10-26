import { useParams } from "react-router-dom"

function ProjectDtls() {
    const { id } = useParams();
    return (
        <div className="bg-dark-2 h-screen w-full">
            <h1>project id : {id}</h1>
        </div>
    )
}

export default ProjectDtls
