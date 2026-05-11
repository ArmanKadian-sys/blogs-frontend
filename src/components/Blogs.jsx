import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, fetchUser } from "../../store/blogSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateBlog, deleteBlog, clearState } from "../../store/blogSlice";
import { ToastContainer, toast } from 'react-toastify';
import { IoMdAdd } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { LiaComments } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { logout } from "../../store/authSlice";
import Loading from "./Loading";



const Blogs = () => {
  const { blogs, user, isLoading, isLoadingUser } = useSelector((state) => state.blog);
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [filterBlogs, setFilterBlogs] = useState(false);
  const navigate = useNavigate();
  const notify = (message) => toast(message);
  const [isLoadingLocal, changeIsLoadingLocal] = useState({ action: '', id: '' });



  useEffect(() => {
    dispatch(fetchBlogs());
    if (isLoggedIn) {
      console.log("fetching user");
      dispatch(fetchUser());
    }

  }, [dispatch, isLoggedIn]);






  const handleDelete = async (blogId) => {
    changeIsLoadingLocal({ action: "delete", id: blogId });
    let response = null;
    response = await fetch(`https://blogs.armanapp3.xyz/api/blogs/delete/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Bearer" + " " + token
      }
    });

    changeIsLoadingLocal({ action: '', value: '' });

    if (response.status == 500) {
      notify("Error on the server while deleting the blog");
      return;
    }


    dispatch(deleteBlog({ id: blogId }));

  }


  const handleInteraction = async (BlogId, type) => {
    if (!isLoggedIn) {
      notify("You must be logged in to perform this action!");
      return;
    }

    let response = null;
    if (type == "like") {
      changeIsLoadingLocal({ action: "like", id: BlogId });
      response = await fetch(`https://blogs.armanapp3.xyz/api/blogs/update/${BlogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: "Bearer" + " " + token
        },
        body: JSON.stringify({ like: true })
      });
      changeIsLoadingLocal({ action: "", id: '' });

    }
    else if (type == "dislike") {
      changeIsLoadingLocal({ action: "dislike", id: BlogId });
      response = await fetch(`https://blogs.armanapp3.xyz/api/blogs/update/${BlogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: "Bearer" + " " + token
        },
        body: JSON.stringify({ dislike: true })
      });
      changeIsLoadingLocal({ action: "", id: '' });

    }
    else if (type == "decLike") {
      changeIsLoadingLocal({ action: "like", id: BlogId });
      response = await fetch(`https://blogs.armanapp3.xyz/api/blogs/update/${BlogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: "Bearer" + " " + token
        },
        body: JSON.stringify({ decLike: true })
      });
      changeIsLoadingLocal({ action: "", id: '' });

    }
    else if (type == "decDislike") {
      changeIsLoadingLocal({ action: "dislike", id: BlogId });
      response = await fetch(`https://blogs.armanapp3.xyz/api/blogs/update/${BlogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: "Bearer" + " " + token
        },
        body: JSON.stringify({ decDislike: true })
      });
      changeIsLoadingLocal({ action: "", id: '' });

    }



    if (response.status == 404) {
      notify("The blog you are trying to interact with does not exist!");
      navigate("/");
      return;
    }

    else if (response.status == 500) {
      notify("Error on the server while interacting with the blog");
      return;
    }

    response = await response.json();

    dispatch(updateBlog({
      blog: response.blog,
      id: BlogId,
      user: response.newUser
    }));

  }




  console.log("these are the blogs", blogs);

  return (
    <div className="min-h-screen bg-white text-black p-6">

      <div className="flex items-center justify-between gap-4 mb-8 border-b-2 border-yellow-400 pb-4 flex-wrap">


        <div className="flex items-center gap-4">
          {user && (
            <p className="text-lg font-bold">
              Welcome, {user.name}!
            </p>
          )}
        </div>


        {isLoggedIn ? <button className="px-4 py-2 rounded-full bg-black text-white  hover:bg-gray-700 transition" onClick={() => { dispatch(logout()); dispatch(clearState()); }}>
          Logout
        </button> : <div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-full border-2 border-black hover:bg-yellow-100 transition" onClick={() => { navigate("/auth/login") }}>
              Login
            </button>

            <button className="px-4 py-2 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-100 transition" onClick={() => { navigate("/auth/register") }}>
              Register
            </button>


          </div>
        </div>}




      </div>

      <ToastContainer />


      <div className="flex flex-col items-center mb-10">

        {isLoading && isLoadingUser && <h1 className="text-4xl font-extrabold text-center text-black border-b-4 border-yellow-400 inline-block pb-2 mb-8">
          Blogs
        </h1>}


        {isLoggedIn &&
          <div className="flex gap-6 justify-center mb-10">
            <button
              onClick={() => navigate("/add")}
              className="bg-yellow-400 text-black font-semibold px-5 py-5 rounded-full hover:bg-yellow-300 transition text-xl"
            >
              <IoMdAdd />
            </button>

            <button
              onClick={() => setFilterBlogs((prev) => !prev)}
              className={`px-5 py-5  rounded-full font-semibold transition text-xl ${filterBlogs
                ? "bg-black text-yellow-400"
                : "bg-yellow-400 text-black  hover:bg-yellow-300 "
                }`}
            >
              <IoPersonOutline />
            </button>
          </div>

        }












      </div>


      <div >{blogs.length == 0 && <h1 className="text-4xl font-extrabold text-center text-black inline-block pb-2 mb-8">{!isLoggedIn ? "No blogs available at the moment, log in and add the first ever blog!!" : "No blogs available at this point of time, click on the add blog button to add the first blog."}</h1>}
      </div>





      <ul className="flex flex-col gap-6">
        {(filterBlogs
          ? blogs.filter((blog) => blog.author === user._id)
          : blogs
        ).map((blog) => (
          <li
            className="bg-white border-2 border-black rounded-xl p-5  flex flex-col gap-4"
          >

            <div className="flex justify-between">
              <h1 className="text-xl font-bold border-b border-yellow-400 pb-2">
                {blog.title}

              </h1>
              {user && user.blogs.includes(blog._id) && (
                isLoadingLocal && <button
                  onClick={() => handleDelete(blog._id)}
                  className=" hover:text-red-900 text-2xl"
                >
                  {isLoadingLocal.action == "delete" && isLoadingLocal.id == blog._id ? <Loading /> : <MdDeleteOutline />}
                </button>
              )}
            </div>


            <p className="text-gray-800 line-clamp-4">{blog.content}</p>




            <div className="flex justify-between ">


              <div className="flex flex-wrap gap-2 mt-auto">
                {user && user.likes.includes(blog._id) ? (
                  <button
                    onClick={() => handleInteraction(blog._id, "decLike")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-400 bg-yellow-400 text-black font-medium shadow-sm transition-all duration-200 hover:scale-105"
                  >
                    <AiFillLike className="text-xl" />
                    {isLoadingLocal.action == "like" && isLoadingLocal.id == blog._id ? <Loading /> : <span>{blog.likes}</span>}
                  </button>
                ) : (
                  <button
                    onClick={() => handleInteraction(blog._id, "like")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black bg-white text-black font-medium shadow-sm transition-all duration-200 hover:bg-yellow-100 hover:scale-105"
                  >
                    <AiOutlineLike className="text-xl" />
                    {isLoadingLocal.action == "like" && isLoadingLocal.id == blog._id ? <Loading /> : <span>{blog.likes}</span>}
                  </button>
                )}
                {user && user.dislikes.includes(blog._id) ? (
                  <button
                    onClick={() => handleInteraction(blog._id, "decDislike")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black bg-black text-white font-medium shadow-sm transition-all duration-200 hover:scale-105"
                  >
                    <AiFillDislike className="text-xl" />
                    {isLoadingLocal.action == "dislike" && isLoadingLocal.id == blog._id ? <Loading /> : <span>{blog.dislikes}</span>}
                  </button>
                ) : (
                  <button
                    onClick={() => handleInteraction(blog._id, "dislike")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black bg-white text-black font-medium shadow-sm transition-all duration-200 hover:bg-gray-100 hover:scale-105"
                  >
                    <AiOutlineDislike className="text-xl" />
                    {isLoadingLocal.action == "dislike" && isLoadingLocal.id == blog._id ? <Loading /> : <span>{blog.dislikes}</span>}
                  </button>
                )}

                <button
                  onClick={() => navigate(`/comments/${blog._id}`)}
                  className="flex items-center justify-center p-2 rounded-full border-2 border-black bg-white text-black shadow-sm transition-all duration-200 hover:bg-yellow-100 hover:scale-110 gap-2"
                >

                  <LiaComments />
                  <div >Comments</div>

                </button>


              </div>


              <div className="text-sm text-gray-500 font-medium">
                {new Date(blog.date).toLocaleString("en-AU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>

            </div>
          </li>
        ))}
      </ul>
    </div >


  );
};

export default Blogs;