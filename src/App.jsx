import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddBlog from "./components/AddBlog";
import Blogs from "./components/Blogs";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { useSelector } from "react-redux";
import Comments from "./components/Comments";
function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blogs />}></Route>
          <Route path="/auth/login" element={<Login />}></Route>
          <Route path="/auth/register" element={<Register />}></Route>
          <Route path="/comments/:BlogId" element={<Comments />}></Route>
          <Route path="/add" element={<AddBlog />}></Route>
        </Routes>


      </BrowserRouter>

    </>
  )
}

export default App
