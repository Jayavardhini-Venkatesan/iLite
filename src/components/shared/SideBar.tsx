import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"

import { useSignoutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Button } from "../ui/button";
import { sidebarLinks } from "@/constants";


const SideBar = () => {
  const {pathname} = useLocation();
  const { mutate: signOut, isSuccess} = useSignoutAccount();
  const navigate = useNavigate();
  const {user} = useUserContext();
  
  useEffect(() => {
    if (isSuccess) navigate(0);
  
    }, [isSuccess])
  

  return (
    <nav className="Leftsidebar">
      <div className="flex flex-col gap-11">
      <Link to="/" className="flex gap-3 items-center">
          <img 
          src="/assets/images/SVG/logo" 
          alt="logo"
          width={170}
          height={36}
           />
        </Link>
        <Link to= {`/profile/${user.id}`} 
        className="flex items-center gap-3">
         <img 
         src= { user.imageUrl ||'/assets/icons/profile-placeholder'} 
         alt="profile image"
         className="h-14 w-14 rounded-full" />
         <div className="flex flex-col">
          <p className="body-bold">
            {user.name}
          </p>
          <p className="small-regular text-light-3"></p>
         </div>
        </Link>
        
        <ul className="flex flex-col items-center">
         {sidebarLinks.map ((link : INavLink) => {
          const isActive = pathname === link.route;
         return (
          <li key={link.label} 
          className= {`leftsidebar-link group ${
            isActive && 'bg-primary-500'
          }`}>
          <NavLink 
          to={link.route} 
          className= "flex items-centergap-4 p-4"
          >
            <img 
            src= {link.imgURL} 
            alt= {link.label} 
            className={`group-hover:invert-white ${
              isActive && 'invert-white'
            }`}
            />
            {link.label}
          </NavLink>
          </li>
                ) 
             } 
          ) 
        }
        </ul>
      </div>
      <div className="flex gap-4">
          <Button 
          variant= "ghost" 
          className="shad_button_ghost" 
          onClick={() => signOut()}>
           <img src="/assets/icons/logout" alt="logout" />
           <p className="small-medium lg:base-medium">Logout</p>
          </Button>
        </div>
    </nav>
  )
}

export default SideBar