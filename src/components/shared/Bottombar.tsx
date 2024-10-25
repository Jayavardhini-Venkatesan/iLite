import { bottombarLinks } from "@/constants";

import { Link, useLocation } from "react-router-dom"


const Bottombar = () => {
  const {pathname} = useLocation();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map ((link) => {
          const isActive = pathname === link.route;
         return (
          
          <Link 
          to={link.route} 
          key={link.label} 
          className= {` ${ isActive && 'bg-gradient-to-tr from-primary1-500 to-primary2-500 rounded-[10px]'} flex items-center justify-center flex-col gap-1 p-2 transition`}
          >
            <img 
            src= {link.imgURL} 
            alt= {link.label} 
            width={16}
            height={16}
            className={` ${isActive && 'invert-white' }`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
          
                ) 
             } 
          ) 
        }
    </section>
  )
}

export default Bottombar