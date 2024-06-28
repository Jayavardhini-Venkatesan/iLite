
import { Models } from "appwrite"
import { Link } from "react-router-dom"

type UserCardProps ={
    creator: Models.Document
}
const UserCard = ({creator}: UserCardProps) => {
    
  return (
    <div className="user-card">
    <div className="flex-between">
        <div className="grid grid-cols-2 items-center gap-2">
          <Link to={`/profile/${creator.$id}`}>
            <img 
            className="rounded-full w-12 lg:h-12"
            src={creator?.imageUrl || '/assets/icons/profile-placeholder' } 
            alt="creator" />
          </Link>
          <div className="flex flex-col">
           <p className="base-medium lg:body-bold text-light-1">
            {creator.name}
           </p> 
           </div>
        </div>
      </div> 
    </div>
  )
}

export default UserCard