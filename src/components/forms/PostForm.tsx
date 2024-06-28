import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/context/AuthContext"
import FileUploader from "../shared/FileUploader"
import { Textarea } from "../ui/textarea"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"


type PostFormProps ={
    post?: Models.Document;
    action: "Create" | "Update"
}

const PostForm = ({post,action}: PostFormProps) => {
  const {mutateAsync: createPost , isPending: isloadingCreate } = useCreatePost();
  const {mutateAsync: updatePost , isPending: isUpdatingPost } = useUpdatePost()
  
  const { user } = useUserContext();
  const {toast} = useToast();
  const navigate = useNavigate();


 //  Defining form.
const form = useForm<z.infer<typeof PostValidation>>({
  resolver: zodResolver(PostValidation),
  defaultValues: {
    caption: post? post?.caption : "",
    file: [],
    location: post? post?.tags.location :"",
    tags: post? post?.tags.join(',') :""
  },
})
// submit handler.
async function onSubmit(values: z.infer<typeof PostValidation>) {
  if(post && action === 'Update' ){
    const updatedPost= await updatePost( {
      ...values,
      postId: post.$id,
      imageID: post?.imageId,
      imageUrl: post?.imageUrl,
    } )

    if(!updatedPost){
      toast({
        title:'Please try again'
      })
    }
   return navigate('/posts/${post.$id}'); 
  }
   
    const newPost= await createPost( {
      ...values,
      userId: user.id,
    } )

    if(!newPost){
      toast({
        title:'Please try again'
      })
    }
    navigate('/');
}  
  return (
    <Form {...form}>
   
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-9 max-w-5xl ">
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Caption</FormLabel>
            <FormControl>
              <Textarea 
              className ="shad-textarea custom-scrollbar" 
              autoComplete="on" 
              {...field} 
              />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Photos</FormLabel>
            <FormControl>
              
              <FileUploader 
              fieldChange={field.onChange}
              mediaUrl={post?.imageUrl}
               
              />
              
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Location</FormLabel>
            <FormControl>
              <Input 
              type="text" 
              className="shad-input" 
              autoComplete="on"
              {...field} 
              />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
     
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Tags(separated by comma " , ")</FormLabel>
            <FormControl>
              <Input 
              type="text" 
              className="shad-input"
              placeholder="Arts,Expression,Learn"
              autoComplete="on"
              {...field} />
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
      />
      <div  className="flex gap-4 items-center justify-center">
      <Button 
      type="button" 
      className="shad-button_dark_4"
      onClick={() => navigate(-1)}>
        Cancel
      </Button>

      <Button 
      type="submit" 
      className="shad-button_primary whitespace-nowrap"
      disabled={isloadingCreate || isUpdatingPost}>
        {isloadingCreate || isUpdatingPost && <Loader/>}
        {action} Post
      </Button>

      </div>
      
      </form>
      
      </Form>
    
  )
}

export default PostForm