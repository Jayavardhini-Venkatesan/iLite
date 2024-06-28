import { useUserContext } from "@/context/AuthContext";
import { Outlet,Navigate } from "react-router-dom"

const Authlayout = () => {
  const { isAuthenticated } = useUserContext();
  return (
   <div className="bg-dood-image bg-no-repeat bg-cover bg-center bg-fixed h-screen w-full" >
  
      {isAuthenticated? (
      <Navigate to= '/' />
    ):(
      <> 
      <section className="flex justify-center items-center py-10 ">
        <Outlet/>
      </section>
     
      </>
    )}
   </div>
  )
}

export default Authlayout

// className="bg-dood-image bg-center bg-cover bg-no-repeat h-screen w-screen"