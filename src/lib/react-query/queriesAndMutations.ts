import{
     useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUsers, likePost, savePost, searchPosts, signinAccount, signoutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'


export const useCreateUserAccount= () => {
    return useMutation ({
        mutationFn: (user: INewUser)=> createUserAccount(user)
    })
}

export const useSigninAccount= () => {
    return useMutation ({
        mutationFn: (user: {
            email: string; 
            password: string;
        }) => signinAccount(user)
    })
}

export const useSignoutAccount= () => {
    return useMutation ({
        mutationFn: signoutAccount
    })
}

export const useCreatePost= () => {
    const queryClient = useQueryClient();

    return useMutation ({
        mutationFn: (post:INewPost) => createPost(post),
        onSuccess: ()=> {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}

export const  useLikePost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (
        {postId, likesArray}: {postId: string; likesArray: string[]}
    ) => likePost(postId, likesArray),
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POSTS]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_CURRENT_USER]
        })
    }
  })
}

export const  useSavedPost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (
        {postId, userId}: {postId: string; userId: string}
    ) => savePost(postId, userId),
    onSuccess: () => {
       
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POSTS]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_CURRENT_USER]
        })
    }
  })
}

export const  useDeleteSavedPost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (savedRecordId:string) => deleteSavedPost(savedRecordId),
        
    onSuccess: () => {
       
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POSTS]
        })
    
    
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_CURRENT_USER]
        })
    }
  })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:IUpdatePost) => updatePost(post),
        onSuccess:(data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postId, imageID}: {postId:string, imageID:string}) => deletePost(postId, imageID),
        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetposts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;
            const lastId = lastPage?.documents[lastPage?.documents.length-1].$id;

            return lastId
        },
        queryFn: getInfinitePosts,
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery ({
        queryKey: [QUERY_KEYS.SEARCH_POSTS,searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !! searchTerm 
    })
}

// export const useGetUsers = () =>{
//     return useInfiniteQuery({
//         queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//         queryFn: getInfiniteUsers,
//         getNextPageParam: (lastPage) =>{
//             if(!lastPage) return null;
//             const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
//             return lastId
//         }
//     })
// },

export const useGetUsers = (limit?:number) =>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn:() => getUsers(limit)
    })
}
