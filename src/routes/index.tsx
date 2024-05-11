import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/signup" element={<Signup />}/>
    </>
  )
);

export default router;