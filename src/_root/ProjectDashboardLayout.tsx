import BottomBar from "@/components/shared/BottomBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import { projectDashBoardNavLink } from "@/constants"
import { Outlet, useParams } from "react-router-dom"

function ProjectDashboardLayout() {
    const { id } = useParams()
    return (
        <div className="w-full h-full md:flex md:flex-row flex-center md:flex-start flex-col bg-dark-2">
            <LeftSideBar navLinks={projectDashBoardNavLink} basePath={`/projects/${id}`} />
            <Outlet />
            <BottomBar />

        </div>
    )
}

export default ProjectDashboardLayout
