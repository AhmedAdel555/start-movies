import { forwardRef, Ref } from "react"

interface IProp extends React.InputHTMLAttributes<HTMLInputElement>{

}


const Input = forwardRef((props: IProp, ref: Ref<HTMLInputElement>) => {
    return (
      <input
      ref={ref}
      className="block rounded-md px-3 py-3 w-full text-md text-white bg-neutral-700 appearance-none focus:outline-none focus:ring-0 peer"
      {...props}
      />
    )
  }
)

export default Input