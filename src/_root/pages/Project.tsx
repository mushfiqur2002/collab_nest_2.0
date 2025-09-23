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

      
      <div className="mainContainer">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Make changes to your account here.</TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
      <div className="post-forms py-4 md:py-6">
        <ProjectForms />
      </div>
    </div>
  )
}

export default Project


