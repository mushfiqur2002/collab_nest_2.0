import BottomBar from "@/components/shared/BottomBar"
import ProjectLeftSide from "@/components/shared/ProjectLeftSide"
import { Outlet } from "react-router-dom"

function ProjectDashboardLayout() {
    return (
        <div className="w-full h-full md:flex md:flex-row flex-center md:flex-start flex-col bg-dark-2">
            <ProjectLeftSide />
            <section className="flex flex-1 h-full w-full overflow-y-auto py-4 px-2">
                <Outlet />
            </section>
            <BottomBar />

        </div>
    )
}

export default ProjectDashboardLayout
