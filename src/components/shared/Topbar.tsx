import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";


const Topbar = () => {
  const { mutate: signOut, isSuccess} = useSignoutAccount();
  const navigate = useNavigate();
  const {user} = useUserContext();
  
  useEffect(() => {
    if (isSuccess) navigate('/sign-in');
  
    }, [isSuccess])
  

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-2 items-center">
          <img 
          src="/assets/images/SVG/logo.svg" 
          alt="logo"
          width={64}
          height={20}
           />
        </Link>
        
        <div className="flex gap-2 items-center justify-end">
          <Button variant= "ghost" className="shad_button_ghost" onClick={() => signOut()}>
           <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
        
        <Link to= {`/profile/${user.id}`} className="flex gap-2">
         <img 
         src= { user.imageUrl ||'/assets/icons/profile.placeholder.svg'} 
         alt="profile image"
         className="h-8 w-8 rounded-full" />
        </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar