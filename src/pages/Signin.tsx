import { SubmitHandler, useForm } from "react-hook-form"
import Input from "../components/Input"
import { yupResolver } from "@hookform/resolvers/yup"
import { SignInSchema } from "../validation"

interface IFormInput {
  email: string
  password: string
}

const Signin = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(SignInSchema)
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
                     Sign In
                   </h2>
                   <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                       <Input type="email" placeholder="email" {...register("email")}/>
                       <p className="text-blue-700">{errors.email?.message}</p>
                       <Input type="password" placeholder="password" {...register("password")}/>
                       <p className="text-blue-700">{errors.password?.message}</p>
                       <button type="submit" className="bg-blue-800 py-3 text-white font-semibold rounded-md w-full hover:bg-blue-600 transition"
                   >Sign In</button>
                   </form>
              </div>
           </div>
          </div>
      </div>
    </>
  )
}

export default Signin