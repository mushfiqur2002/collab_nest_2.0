import { LayoutDashboard } from "lucide-react"
import AdminProjectView from "./AdminProjectView"

function ProjectDashBoard() {
    return (
        <div>
            <div className="header">
                <span className="text-xl font-semibold py-2 flex flex-start gap-1">
                    <LayoutDashboard />
                    <p className="text-2xl">Dashboard</p>
                </span>
            </div>
            <AdminProjectView />



        </div>
    )
}

export default ProjectDashBoard
