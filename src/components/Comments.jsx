import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import { updateBlog } from "../../store/blogSlice";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const Comments = () => {
  const { BlogId } = useParams();
  console.log("this is id", BlogId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blogs } = useSelector(state => state.blog);
  const { token, isLoggedIn } = useSelector(state => state.auth);
  console.log("comments", blogs);
  const blog = blogs.find((b) => String(b._id) === String(BlogId));
  const commentInputRef = useRef(null);
  const notify = (message) => toast(message);
  const [isLoading, changeIsLoading] = useState(false);



  const handleComment = async () => {
    changeIsLoading(true);
    if (!isLoggedIn) {
      notify("You must be logged in to comment!");
      commentInputRef.current.value = "";
      changeIsLoading(false);
      return;
    }
    if (commentInputRef.current.value == "") {
      notify("Cannot post empty comment");
      changeIsLoading(false);
      return;
    }
    const commentContent = commentInputRef.current.value;
    const response = await fetch(`https://blogs.armanapp3.xyz/api/blogs/update/${BlogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authentication: "Bearer" + " " + token
      },
      body: JSON.stringify({ comment: commentContent })
    });

    changeIsLoading(false);
    if (response.status == 404) {
      notify("The blog you are trying to comment on does not exist!");
      navigate("/");
      return;
    }

    if (response.status == 500) {
      notify("Error on the server adding comment");
      return;
    }

    const newComment = await response.json();
    dispatch(updateBlog({ blog: newComment, id: BlogId }));
    commentInputRef.current.value = "";
    navigate("/");

  }

  console.log("this is blog", blog);

  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <ToastContainer />

        <h2 className="text-3xl font-bold text-center mb-6">
          Comments
        </h2>

        {blog.comments.length === 0 && (
          <p className="text-center text-gray-500 mb-6">
            No comments yet.
          </p>
        )}

        <div className="flex flex-col gap-4 mb-6">
          {blog.comments.map((comment) => {
            return (
              <div

                className="flex flex-col gap-2 border-2 border-black rounded-xl p-4 bg-white shadow-sm"
              >
                <p className="text-black">{comment.content}</p>

                <p className="text-sm text-gray-500 font-medium">
                  By: {comment.name}
                </p>

              </div>
            );
          })}
        </div>


        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Write a comment..."
            ref={commentInputRef}
            className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-yellow-400 transition"
          />

          <button
            onClick={handleComment}
            className="bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 transition-all duration-200 hover:scale-[1.02]"
          >
            {isLoading ? <div className="flex justify-center"><Loading /></div> : "Add Comment"}
          </button>
        </div>
      </div>

    </>


  )

}

export default Comments;