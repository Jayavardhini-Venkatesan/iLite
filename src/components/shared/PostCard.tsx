import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { formatDateString } from "@/lib/utils"
import PostStatus from "./PostStatus"


type PostCardProps={
  post: Models.Document
}

const PostCard = ({post}: PostCardProps) => {

const {user} = useUserContext();

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img 
            className="rounded-full w-12 lg:h-12"
            src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder' } 
            alt="creator" />
          </Link>
          <div className="flex flex-col">
           <p className="base-medium lg:body-bold text-light-1">
            {post.creator.name}
           </p>
           <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                //create relative date using formatedate
                {formatDateString (post.$createdAt)}
              </p>
               -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
           </div>
          </div>
        </div>
        <Link to={`/update-post/${post.$id}`}
              className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img 
          src="/assets/icons/edit" 
          alt="edit"
          width={20}
          height={20} />
        </Link>
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>
            {post.caption}
          </p>
            <ul>
              {post.tags.map((tag:string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
          <img 
          src= {post.imageUrl || '/assets/icons/profile-placeholder'} 
          alt="post image"
          className="post-card_img" 
          />
      </Link>

      <PostStatus post= {post} userId= {user.id} />
    </div>
  )
}

export default PostCard