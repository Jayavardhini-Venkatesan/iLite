import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";




export async function createUserAccount(user:INewUser) {
    try {
        const newAccount= await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
            )
            if(!newAccount) throw Error;
            const avatarUrl= avatars.getInitials(user.name)

            const newUser = await saveUserToDB( {
                accountID: newAccount.$id,
                name: newAccount.name,
                email: newAccount.email,
                imageUrl: avatarUrl,
                username: user.username

            })

            return newUser;
        
    } catch (error) {
        console.log("Appwrite service :: createUserAccount ::",error)
        
     }
}

export async function saveUserToDB(user: {

    accountID: string
    name: string
    email:string
    imageUrl: URL
    username?: string
}) {
    try {
        
        const newUser= await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
    } catch (error) {
        console.log ("Appwrite service :: saveUserToDB ::",error)
        
    }
}
    

export async function signinAccount(user: { 
    email:string; 
    password: string;
}) {
   try {
    const session = await account.createEmailSession(user.email,user.password)

    return session
   } catch (error) {
    console.log("Appwrite service :: signinAccount ::",error);
    
   }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
    try {
    const currentAccount = await getAccount()
    
    if (!currentAccount) throw Error;
    
    
    const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountID',currentAccount.$id)]
    )

    if (!currentUser) throw Error;
   
    return currentUser.documents[0];
     } catch (error) {
      console.log("Appwrite service :: getCurrentUser ::",error);
    }
 }
 

export async function signoutAccount() {
    try {
        const session = await account.deleteSession("current")

        return session;
    } catch (error) {
        console.log (error)
    }
    
}

export async function createPost(post:INewPost) {
 try {
    //for uploading image to storage
 const uploadedfile = await uploadfile(post.file[0])   
 
 if(!uploadedfile) throw Error
 // get file url

 const fileUrl = getFilePreview (uploadedfile.$id)
 if(!fileUrl){
    deletFile (uploadedfile.$id)
    throw Error
 } 
   

//convert tags in an array
const tags= post.tags?.replace(/ /g,'').split(',') || [];

// save post to database
   const newPost= await databases.createDocument(
   appwriteConfig.databaseId,
   appwriteConfig.postCollectionId,
   ID.unique(),
   {
     creator: post.userId,
     caption: post.caption,
     imageUrl: fileUrl,
     imageID: uploadedfile.$id,
     location: post.location,
     tags: tags  
   }
)
    if(!newPost){
        await deletFile(uploadedfile.$id)
        throw Error
    }
    return (newPost)

 } catch (error) {
   console.log(error) 
 }   
}

export async function uploadfile(file:File) {
 try {
    const uploadedfile =  await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
    )
    return uploadedfile
 } catch (error) {
   console.log(error) 
 }   
}
 
export function getFilePreview(fileId:string) {
   try {
    const fileUrl = storage.getFilePreview (
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        )
        if (!fileUrl) throw Error
        return (fileUrl)
   } catch (error) {
     console.log(error)
   } 
 }
export async function deletFile(fileId:string) {
 try {
   await storage.deleteFile(appwriteConfig.storageId, fileId) 
   return {status: 'ok'}
 } catch (error) {
    console.log(error)
 }   
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
   if (!posts) throw Error
   return posts 
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
    const updatedPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
    {
        likes: likesArray
    }
    )
    if (!updatedPost) throw Error;  
    return updatedPost   
    } catch (error) {
      console.log(error) 
    }   
   }

   export async function savePost(postId: string, userId:string) {
    try {
    const savedPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
    {
        user: userId,
        post: postId,
    }
    )
    if (!savedPost) throw Error;  
    return savedPost   
    } catch (error) {
      console.log(error);
    }   
   }

   export async function deleteSavedPost(savedRecordId: string) {
    try {
    const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId,
    )
    if (!statusCode) throw Error;  
    return {status :"ok"}   
    } catch (error) {
      console.log(error);
    }   
   }

   export async function getPostById(postId:string) {
    try {
      const post = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      )  
       return post;

    } catch (error) {
      console.log(error);  
    }
   }

   export async function updatePost(post:IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {

    let image = {
        imageUrl: post.imageUrl,
        imageID: post.imageID
    }

    if (hasFileToUpdate){
     //for uploading image to storage
    const uploadedfile = await uploadfile(post.file[0])   
    
    if(!uploadedfile) throw Error
    // get file url
   
    const fileUrl = getFilePreview (uploadedfile.$id)
    if(!fileUrl){
       deletFile (uploadedfile.$id)
       throw Error
    } 
      image = {...image, imageUrl:fileUrl, imageID:uploadedfile.$id}
    }
       
   
   //convert tags in an array
   const tags= post.tags?.replace(/ /g,'').split(',') || [];
   
   // save post to database
      const updatedPost= await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageID: image.imageID,
        location: post.location,
        tags: tags  
      }
   )
       if(!updatedPost){
           await deletFile(post.imageID)
           throw Error
       }
       return (updatedPost)
   
    } catch (error) {
      console.log(error) 
    }   
   }

   export async function deletePost (postId: string, imageID:string){
    if(!postId || !imageID) throw Error;
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      )  
      return {status: "ok"}
    } catch (error) {
      console.log(error);   
    }
   }
   
   export async function getInfinitePosts({pageParam}:{pageParam:any}) {
    const queries:any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
      )
      if(!posts) throw Error

      return posts
    } catch (error) {
      console.log(error);   
    }
   }

   export async function searchPosts(searchTerm:string) {
     try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search('caption',searchTerm)]
      )
      if(!posts) throw Error

      return posts
    } catch (error) {
      console.log(error);   
    }
   }

 

  export async function getUsers() {
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      )
      if (!users) throw Error;
      return users;
    } catch (error) {
      console.log("Appwrite service :: getUsers ::",error)
    }
  }

  export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
      let image = {
        imageUrl: user.imageUrl,
        imageId: user.imageID,
      };
  
      if (hasFileToUpdate) {
        
        const uploadedFile = await uploadfile(user.file[0]);
        if (!uploadedFile) throw Error;
  
       
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await deletFile(uploadedFile.$id);
          throw Error;
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
  
   
      const updatedUser = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.userId,
        {
          name: user.name,
          bio: user.bio,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
        }
      );
  
    
      if (!updatedUser) {
       
        if (hasFileToUpdate) {
          await deletFile(image.imageId);
        }

        throw Error;
      }

      if (user.imageID && hasFileToUpdate) {
        await deletFile(user.imageID);
      }
  
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }