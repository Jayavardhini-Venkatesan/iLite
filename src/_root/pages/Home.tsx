import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";



const Home = () => {
  const { data: posts , isPending: isPostLoading, isError: isErrorPosts} = useGetRecentPosts();
  const {data: creators, isPending: isUSerLoading, isError:isErrorUser} = useGetUsers();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {
            isErrorPosts ||(isPostLoading && !posts)?(
             <Loader /> 
            ):(
              <ul className="flex flex-col flex-1 gap-9 w-full">
               {posts?.documents.map((post:Models.Document) => (
                <PostCard post = {post} />
               ))}
              </ul>
            )
            }
        </div>
        <div className="home-creators">
        <h2 className="h3-bold md:h2-bold text-left w-full">Connect with people</h2>
        {
            isUSerLoading || isErrorUser?(
             <Loader /> 
            ):(
              <ul className="flex flex-col flex-1 gap-9 w-full">
               {creators?.documents.map((creator:Models.Document) => (
                <UserCard creator= {creator} />
               ))}
              </ul>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home