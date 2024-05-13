import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Detail from "../pages/detail/Detail"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/" element={<h1 >A7A</h1>}/>
      <Route path="/test" element={<Detail />}/>
    </>
  )
);

export default router;