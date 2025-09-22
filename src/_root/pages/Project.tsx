import { SquarePen } from "lucide-react"
import ProjectForms from "@/components/forms/ProjectForms"
function Project() {
  return (
    <div className="w-full py-2 px-4 md:px-6 md:py-6">
      <div className="flex flex-1 gap-2 flex-start py-2">
        <SquarePen />
        <p className="capitalize text-xl">create post</p>
      </div>
      <div className="post-forms py-4 md:py-6">
        <ProjectForms/>
      </div>
    </div>
  )
}

export default Project


