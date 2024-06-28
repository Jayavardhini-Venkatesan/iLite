import { Outlet,Navigate } from "react-router-dom"

const Authlayout = () => {
  const isAuthenticated = false
  return (
   <div className="bg-dood-image bg-center bg-cover bg-no-repeat">
      {isAuthenticated? (
      <Navigate to= '/' />
    ):(
      <> 
      <section className="flex flex-1 flex-col justify-center items-center py-10 ">
        <Outlet/>
      </section>
     
      </>
    )}
   </div>
  )
}

export default Authlayout