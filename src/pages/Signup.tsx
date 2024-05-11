import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../components/Input";
import { useForm, SubmitHandler } from "react-hook-form"
import { SignUpSchema } from "../validation";

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
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

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
                       <button type="submit" className="bg-blue-800 py-3 text-white font-semibold rounded-md w-full hover:bg-blue-600 transition"
                   >Sign Up</button>
                   </form>
              </div>
           </div>
          </div>
      </div>
    </>
  );
};

export default Signup;
