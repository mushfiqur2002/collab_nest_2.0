import BottomBar from "@/components/shared/BottomBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import TopBar from "@/components/shared/TopBar"
import { navLinks } from "@/constants"
import { Outlet } from "react-router-dom"

function RootLayout() {
  navLinks
  return (
    <div className="w-full h-full md:flex md:flex-row flex-center md:flex-start flex-col bg-dark-2">
      <TopBar />
      <LeftSideBar navLinks={navLinks} />
      <section className="flex flex-1 h-full w-full md:max-w-[500px] md:w-full overflow-y-auto">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  )
}

export default RootLayout
