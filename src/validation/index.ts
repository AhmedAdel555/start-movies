import * as yup from "yup"

export const SignUpSchema = yup
  .object({
    username: yup.string().required(),
    email: yup.string().email("Invalid email address").required(),
    password: yup.string().min(8, "Password must be at least 8 characters").required(), 
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required()
  })
  .required()

export const SignInSchema = yup
.object({
  email: yup.string().email("Invalid email address").required(),
  password: yup.string().min(8, "Password must be at least 8 characters").required(), 
})
.required()