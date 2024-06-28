import Bottombar from "@/components/shared/Bottombar"
import SideBar from "@/components/shared/SideBar"
import Topbar from "@/components/shared/Topbar"
import { Outlet } from "react-router-dom"


const Rootlayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <SideBar/>
    
    <div className="flex flex-1 h-full">
      <Outlet />
    </div>

    <Bottombar/>
    </div>
  )
}

export default Rootlayout