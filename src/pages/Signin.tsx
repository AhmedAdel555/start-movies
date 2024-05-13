import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignInSchema } from "../validation";
import { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from "@mui/material"; 

interface IFormInput {
  email: string;
  password: string;
}

const Signin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(SignInSchema),
  });

  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true); // Start showing spinner
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("User logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false); // Stop showing spinner after success or failure
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
              <h2 className="text-white text-4xl mb-8 font-semibold">Sign In</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <Input type="email" placeholder="email" {...register("email")} />
                <Input type="password" placeholder="password" {...register("password")} />
                <div className="flex justify-center">
                  {isLoading ? (
                    <CircularProgress color="primary" size="2rem" /> 
                  ) : (
                    <button type="submit" className="bg-blue-800 py-3 text-white font-semibold rounded-md w-full hover:bg-blue-600 transition">
                      Sign In
                    </button>
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

export default Signin;
