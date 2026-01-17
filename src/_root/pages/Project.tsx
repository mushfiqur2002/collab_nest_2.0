import { File, SquarePen } from "lucide-react"
import ProjectForms from "@/components/forms/ProjectForms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectDetails from "@/constants/ProjectDetails"
import { useUserContext } from "@/context/AuthContext"
import WorkerProjectView from "@/components/shared/WorkerProjectView"
function Project() {
  const { user } = useUserContext()
  const userCategory = user?.category
  return (
    <div className="w-full py-2 px-4 md:px-0">
      <div className="flex flex-1 gap-2 flex-start py-2">
        {
          userCategory === 'recruiter' ? (
            <div className="flex gap-2 items-center">
              <SquarePen />
              <p className="capitalize text-xl">create project</p>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <File />
              <p className="capitalize text-xl">projects</p>
            </div>
          )
        }
      </div>

      {
        userCategory === 'recruiter' ? (
          <div className="mainContainer post-forms py-4 md:py-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="h-auto p-0">
                {/* create trigger */}
                <TabsTrigger value="create" className="capitalize data-[state=active]:bg-dark-4 data-[state=active]:text-white data-[state=active]:shadow-sm transition rounded-tl-lg rounded-tr-0">
                  create
                </TabsTrigger>

                {/* details trigger */}
                <TabsTrigger value="details" className="capitalize data-[state=active]:bg-dark-4 data-[state=active]:text-white data-[state=active]:shadow-sm transition rounded-tr-lg rounded-tl-0">
                  details
                </TabsTrigger>
              </TabsList>


              {/* create content */}
              <TabsContent value="create" className="bg-dark-4 mt-0 px-4 py-4">
                <ProjectForms />
              </TabsContent>

              {/* details content */}
              <TabsContent value="details" className="bg-dark-4 mt-0 px-4 py-4">
                <ProjectDetails />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <WorkerProjectView />
            
          </div>
        )
      }


    </div>
  )
}

export default Project


