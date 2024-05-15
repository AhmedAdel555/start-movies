import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Detail from "../pages/detail/Detail"
import AddFilmForm from "../pages/addFilm";
import GetAndSetData from "../pages/GetDataAndSetIt"; 
import GetAndSetData2 from "../pages/GetFilmPaginatition";
import GetAndSetData3 from "../pages/GetFilmPaginatitionCateogry";
import Search from "../pages/Search";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/" element={<h1 >A7A</h1>}/>
      <Route path="/test" element={<Detail />}/>
      <Route path="/test2" element={<AddFilmForm />}/>
      <Route path="/test3" element={<GetAndSetData />} />
      <Route path="/test4" element={<GetAndSetData2 />} />
      <Route path="/test5" element={<GetAndSetData3 />} />
      <Route path="/search" element={<Search />} />
    </>
  )
);

export default router;