import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import { SignupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"

import { useCreateUserAccount, useSigninAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"




const SignupForm = () => {
const {toast} = useToast()
const { checkAuthUser, isLoading: isUserLoading} = useUserContext();
const navigate = useNavigate();

const{mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
const{mutateAsync: signinAccount, isPending: isSigningIn } = useSigninAccount()

  //  Defining form.
const form = useForm<z.infer<typeof SignupValidation>>({
  resolver: zodResolver(SignupValidation),
  defaultValues: {
    name: "",
    username: "",
    email:"",
    password: "",
  },
})

// submit handler.
async function onSubmit(values: z.infer<typeof SignupValidation>) {
  // to create user
  const newuser= await createUserAccount( values )

  if(!newuser) {
    return  toast({
      title: "Sign up failed. Please try again later."
      
    })
  }
     const session= await signinAccount({
      email: values.email,
      password: values.password
     })

     if(!session){
      return  toast({
        title: "Sign in failed. Please try again later."

        
      })
     }

     const isLoggedIn = await checkAuthUser();
     
     if (isLoggedIn){
      form.reset();

      navigate('/')
     } else{
      return toast({
        title: "Sign up failed. Please try again later."

      })
     }

  
}
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="\assets\images\SVG\logo.svg" 
        alt="logo"
        width={140} 
        height={100} />

        <h2 className="h3-bold md:h2-bold pt-5 md:pt-12">Create a new account</h2>

        <p className="text-light-3 small-medium md:base-regular mt-2"> To get into ilite,please enter your account details</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full mt-4 ">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} autoComplete="on"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Userame</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} autoComplete="on" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="shad-input" {...field} autoComplete="on"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} autoComplete="on"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="shad-button_primary mt-2 font-bold md:mt-4">
          {isCreatingAccount || isUserLoading || isSigningIn ? (
            <div className="flex-center gap2"> <Loader/>Loading...</div>
          ): "Sign up" }
        </Button>

        <p className="flex justify-center">
          Already have an account?
          <Link to="/sign-in" className="text-primary1-500 text-small-semibold ml-1">
           Log in
          </Link>
        </p>
      </form>
      </div>
      </Form>
  )
}

export default SignupForm