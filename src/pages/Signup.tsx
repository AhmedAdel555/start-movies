import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../components/Input";
import { useForm, SubmitHandler } from "react-hook-form"
import { SignUpSchema } from "../validation";
import { useState } from "react";
import { firestore, auth, doc, setDoc, createUser } from "../firebase";
import {useNavigate } from 'react-router-dom';
import { CircularProgress } from "@mui/material"; 

interface IFormInput {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Signup = () => {

  const { register, handleSubmit, formState: { errors }} = useForm<IFormInput>({
    resolver: yupResolver(SignUpSchema)
  })

  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Create user using Firebase Authentication
      setIsLoading(true); 
      const { user } = await createUser(auth, data.email, data.password); 
  
      // Add user information to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        username: data.username,
        email: data.email,
        id:user.uid,
        savedToWatchLater:[],
        isAdmin:false
      });
  
      console.log("User created successfully!", user);
      navigate("/signin");
      
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error) {
        console.log(error.message);
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          setErrorMessage("Email is already in use. Please try with a different email.");
        } else {
          setErrorMessage("An error occurred while creating your account. Please try again later.");
          
        }
      } else {
        setErrorMessage("An unknown error occurred. Please try again later.");
        
      }
    }finally{
        setIsLoading(false); 
    }
  };


  return (
    <>
      <div className="h-screen w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-fixed bg-cover">
          <div className="bg-black w-full h-full lg:bg-opacity-50">
            <nav>
                <h1 className="text-white italic text-4xl ml-5">Star Movies</h1>
            </nav>
           <div className="flex justify-center">
              <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:max-w-md rounded-md w-full">
                   <h2 className="text-white text-4xl mb-8 font-semibold">
                     Sign Up
                   </h2>
                   <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                       <Input type="text" placeholder="username" {...register("username")}/>
                       <p className="text-blue-700">{errors.username?.message}</p>
                       <Input type="email" placeholder="email" {...register("email")}/>
                       <p className="text-blue-700">{errors.email?.message}</p>
                       <Input type="password" placeholder="password" {...register("password")}/>
                       <p className="text-blue-700">{errors.password?.message}</p>
                       <Input type="password" placeholder="confirm password" {...register("confirmPassword")}/>
                       <p className="text-blue-700">{errors.confirmPassword?.message}</p>
                       <div className="flex justify-center">
                       {isLoading ? (
                    <CircularProgress color="primary" size="2rem" /> 
                  ) : (
                    <button type="submit" className="bg-blue-800 py-3 text-white font-semibold rounded-md w-full hover:bg-blue-600 transition">Sign Up</button>
                  )}
                       </div>
                       
                       {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                   </form>
              </div>
           </div>
          </div>
      </div>
    </>
  );
};

export default Signup;
