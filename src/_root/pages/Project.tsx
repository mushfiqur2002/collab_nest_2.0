import { SquarePen } from "lucide-react"
import ProjectForms from "@/components/forms/ProjectForms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
function Project() {
  return (
    <div className="w-full py-2 px-4 md:px-6 md:py-6">
      <div className="flex flex-1 gap-2 flex-start py-2">
        <SquarePen />
        <p className="capitalize text-xl">create post</p>
      </div>


      <div className="mainContainer post-forms py-4 md:py-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="h-auto p-0">
            {/* create trigger */}
            <TabsTrigger value="account" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition rounded-tl-lg rounded-tr-0">
              Account
            </TabsTrigger>

            {/* details trigger */}
            <TabsTrigger value="password" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm transition rounded-tr-lg rounded-tl-0">
              Password
            </TabsTrigger>
          </TabsList>
          {/* create content */}
          <TabsContent value="account" className="bg-gray-700 mt-0 px-4 py-4">
            <ProjectForms />
          </TabsContent>

          {/* details content */}
          <TabsContent value="password" className="bg-gray-700 mt-0 px-4 py-4">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Project


