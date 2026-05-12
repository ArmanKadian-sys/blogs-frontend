import { useRef } from "react";
import { addBlog } from "../../store/blogSlice";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "./Loading";


const AddBlog = () => {
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const { token, isLoggedIn } = useSelector(state => state.auth);
  const notify = (message) => toast(message);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, changeIsLoading] = useState(false);


  const handleAdd = async () => {
    changeIsLoading(true);
    if (!isLoggedIn) {
      notify("Please log in to add your blog");
      return;
    }

    if (contentRef.current.value == '' || titleRef.current.value == '') {
      notify("You left a field empty");
      changeIsLoading(false);
      return;
    }

    const response = await fetch(`https://blogs.armanapp3.xyz/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Bearer" + " " + token
      },
      body: JSON.stringify({
        content: contentRef.current.value,
        title: titleRef.current.value
      })
    });


    changeIsLoading(false);
    if (response.status == 500) {
      notify("server error while adding the blog");
      contentRef.current.value = "";
      titleRef.current.value = "";
      return;
    }



    const data = await response.json();

    dispatch(addBlog({ blog: data.blog, newUser: data.newUser }));
    contentRef.current.value = "";
    titleRef.current.value = "";
    navigate("/");



  }




  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-xl p-6 shadow-lg">

        <ToastContainer />

        <h1 className="text-2xl font-bold mb-6 text-center border-b-2 border-yellow-400 pb-2">
          Add Blog
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Title"
            ref={titleRef}
            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:border-yellow-400 transition"
          />

          <textarea
            placeholder="Content"
            ref={contentRef}
            rows={6}
            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:border-yellow-400 transition resize-none"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition-all duration-200 hover:scale-[1.02]"
          >
            {isLoading ? <div className="flex justify-center"><Loading /></div> : "Add Blog"}
          </button>

        </div>
      </div>
    </div>

  )
}


export default AddBlog;