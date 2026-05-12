import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";



const Register = () => {
  const navigate = useNavigate();
  const [errors, changeErrors] = useState([]);
  const [isLoading, changeLoading] = useState(false);
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirm_password = useRef(null);


  const onSubmit = async () => {
    changeLoading(true);


    const nameSend = name.current.value;
    const emailSend = email.current.value;
    const passwordSend = password.current.value;
    const confirm_passwordSend = confirm_password.current.value;


    const response = await fetch("https://blogs.armanapp3.xyz/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          name: nameSend,
          email: emailSend,
          password: passwordSend,
          confirmPassword: confirm_passwordSend,
        }
      )
    });

    const data = await response.json();
    changeLoading(false);

    if (response.status == 422) {
      changeErrors([data.message]);
      return;
    }

    navigate("/auth/login");
  }

  return (
    <div className="min-h-screen flex bg-black text-white">


      <div className="hidden md:flex w-[65%] items-center justify-center bg-yellow-400">
        <div className="text-center px-10">
          <h1 className="text-6xl font-black text-black mb-6">
            Join Us Today
          </h1>

          <p className="text-black text-lg font-medium max-w-lg">
            Start posting your ideas today!!
          </p>
        </div>
      </div>


      <div className="w-full md:w-[35%] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-black border border-yellow-400 rounded-3xl p-8 shadow-2xl">

          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            {isLoading ? "Loading..." : "Register"}
          </h1>

          <p className="text-white/60 mb-8">
            Create your new account
          </p>

          {errors.length > 0 && (
            <ul className="bg-black text-yellow p-4 rounded-2xl mb-5  flex flex-col">
              {errors.map((error, i) => (
                <li className="font-medium">
                  {error}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-5">

            <input
              ref={name}
              placeholder="Name"
              className="bg-white text-black px-5 py-4 rounded-full outline-none border-2 border-transparent focus:border-yellow-400 transition-all"
            />

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

            <input
              ref={confirm_password}
              type="password"
              placeholder="Confirm Password"
              className="bg-white text-black px-5 py-4 rounded-full outline-none border-2 border-transparent focus:border-yellow-400 transition-all"
            />

            <button
              onClick={onSubmit}
              className="bg-yellow-400 text-black font-bold py-4 rounded-full hover:bg-yellow-300 transition-all duration-300"
            >
              {isLoading ? "Loading..." : "Create Account"}
            </button>

            <button
              onClick={() => navigate("/auth/login")}
              className="border border-yellow-400 text-yellow-400 py-4 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              Login
            </button>

          </div>
        </div>
      </div>
    </div>
    // <div className="min-h-screen flex flex-col md:flex-row bg-black">


    //   <div className="hidden md:block md:w-[70%] h-screen">
    //     <img
    //       alt="img"
    //       className="w-full h-full object-cover"
    //     />
    //   </div>


    //   <div className="w-full md:w-[30%] flex items-center justify-center text-white px-6 py-10 md:px-0 md:py-0">
    //     <div className="w-full max-w-md md:w-[70%] flex flex-col gap-6 md:gap-10">

    //       <h1 className="text-2xl md:text-3xl tracking-tight leading-tight text-center md:text-left">
    //         {isLoading ? <>Loading</> : "Register"}
    //       </h1>

    //       {errors.map((error, i) => (
    //         <ul className="text-sm text-white/60">
    //           <li>{error}</li>
    //         </ul>
    //       ))}

    //       <input className="bg-white text-black border p-4 md:p-5 rounded-full placeholder-gray-500" placeholder="name" ref={name} />
    //       <input className="bg-white text-black border p-4 md:p-5 rounded-full placeholder-gray-500" type="text" placeholder="email" ref={email} />
    //       <input className="bg-white text-black border p-4 md:p-5 rounded-full placeholder-gray-500" type="password" placeholder="password" ref={password} />
    //       <input className="bg-white text-black border p-4 md:p-5 rounded-full placeholder-gray-500" type="password" placeholder="confirm_password" ref={confirm_password} />

    //       {isLoading ? <>Loading</> : (
    //         <button onClick={onSubmit}>
    //           Submit
    //         </button>
    //       )}
    //       <button onClick={"/auth/login"}>Login</button>

    //     </div>
    //   </div>
    // </div>
  )
}

export default Register;