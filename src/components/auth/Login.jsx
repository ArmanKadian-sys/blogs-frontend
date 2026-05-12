import { useRef, useState } from "react";
import { login } from "../../../store/authSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";




const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, changeError] = useState([]);
  const email = useRef(null);
  const password = useRef(null);
  const [isLoading, changeLoading] = useState(false);


  const handleSubmit = async () => {
    changeLoading(true);
    const emailSend = email.current.value;
    const passwordSend = password.current.value;
    console.log(emailSend);
    console.log(passwordSend);


    const response = await fetch("https://blogs.armanapp3.xyz/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          email: emailSend,
          password: passwordSend,
        }
      )
    });


    const data = await response.json();
    changeLoading(false);

    if (response.status == 422) {
      changeError(data.message);
      return;
    }

    dispatch(login(data));
    navigate("/");

  }


  return (
    <div className="min-h-screen flex bg-black text-white">


      <div className="hidden md:flex w-[65%] items-center justify-center bg-yellow-400">
        <div className="text-center px-10">
          <h1 className="text-6xl font-black text-black mb-6">
            Welcome Back
          </h1>

          <p className="text-black text-lg font-medium max-w-lg">
            Login to create blogs, like blogs or comment on blogs
          </p>
        </div>
      </div>


      <div className="w-full md:w-[35%] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-black border border-yellow-400 rounded-3xl p-8 shadow-2xl">

          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            {isLoading ? "Loading..." : "Login"}
          </h1>

          <p className="text-white/60 mb-8">
            Enter your details here
          </p>

          {errors && (
            <div className="bg-black text-yellow p-3 rounded-xl mb-5 font-medium">
              {errors}
            </div>
          )}

          <div className="flex flex-col gap-5">

            <input
              ref={email}
              type="text"
              placeholder="Email"
              className="bg-white text-black px-5 py-4 rounded-full outline-none border-2 border-transparent focus:border-yellow-400 transition-all"
            />

            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="bg-white text-black px-5 py-4 rounded-full outline-none border-2 border-transparent focus:border-yellow-400 transition-all"
            />

            <button
              onClick={handleSubmit}
              className="bg-yellow-400 text-black font-bold py-4 rounded-full hover:bg-yellow-300 transition-all duration-300"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            <button
              onClick={() => navigate("/auth/register")}
              className="border border-yellow-400 text-yellow-400 py-4 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              Register
            </button>

          </div>
        </div>
      </div>
    </div>
    // <>
    //   <div className="min-h-screen flex flex-col md:flex-row bg-black">


    //     <div className="hidden md:block md:w-[70%] h-screen">
    //       <img

    //         alt="img"
    //         className="w-full h-full object-cover"
    //       />
    //     </div>


    //     <div className="w-full md:w-[30%] flex items-center justify-center text-white px-6 py-10 md:px-0 md:py-0">
    //       <div className="w-full max-w-md md:w-[70%] flex flex-col gap-6 md:gap-10">

    //         <h1 className="text-2xl md:text-3xl tracking-tight leading-tight text-center md:text-left">
    //           {isLoading ? <>loading</> : "Login"}
    //         </h1>

    //         <h1 className="text-xl text-white/20" >{errors}</h1>


    //         <input className="bg-white text-black border p-4 md:p-5 rounded-full placeholder-gray-500" type="text" placeholder="email" ref={email} />
    //         <input className="bg-white text-black border p-4 md:p-5 rounded-full placeholder-gray-500" type="password" placeholder="password" ref={password} />


    //         {isLoading ? <>Loading</> : (
    //           <button onClick={handleSubmit}>
    //             Login
    //           </button>
    //         )}


    //         <button onClick={() => { navigate("/auth/register") }}>Register</button>

    //       </div>
    //     </div>
    //   </div>

    // </>
  )
}

export default Login;