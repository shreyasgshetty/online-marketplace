import { useState } from "react";
import API from "../services/api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

const handleSubmit = async (e) => {

  e.preventDefault();

  const user = { name, email, password };

  try {

    await API.post("/api/auth/register", user);

    toast.success("Account created successfully 🎉", {
      icon: "✅",
      style: {
        borderLeft: "5px solid #3b82f6"
      }
    });

    setName("");
    setEmail("");
    setPassword("");

    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch(error) {

    toast.error("Registration failed. Try again.", {
      icon: "⚠️",
      style: {
        borderLeft: "5px solid #ef4444"
      }
    });

  }

};

const googleLogin = async () => {

  try {

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const data = {
      name: user.displayName,
      email: user.email,
      password: "GOOGLE_AUTH"
    };

    await API.post("/api/auth/register", data);

    toast.success("Logged in with Google 🚀", {
      icon: "🔵",
      style: {
        borderLeft: "5px solid #3b82f6"
      }
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch(error) {

    toast.error("Google login failed", {
      icon: "❌",
      style: {
        borderLeft: "5px solid #ef4444"
      }
    });

  }

};

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">

    <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#ffffff",
      color: "#1f2937",
      borderRadius: "10px",
      padding: "14px 16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      border: "1px solid #e5e7eb"
    }
  }}
/>
      {/* Main Title */}

      <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 animate-fade-in">
        Online-Marketplace
      </h1>


      {/* Card */}

      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl animate-slide-up">


        {/* Left Section */}

        <div className="hidden md:flex md:w-1/2 bg-blue-500 text-white p-10 flex-col justify-center">

          <h1 className="text-4xl font-bold mb-4">
            Welcome!
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed">
            Create your account and start exploring the platform.
            Manage your profile, access services, and experience
            a seamless digital marketplace built for convenience.
          </p>

        </div>



        {/* Right Section */}

        <div className="w-full md:w-1/2 p-8 md:p-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Fill in your details to register
          </p>


          <form onSubmit={handleSubmit} className="space-y-4">

            <div>

              <label className="text-sm text-gray-600">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>


            <div>

              <label className="text-sm text-gray-600">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>


            <div>

              <label className="text-sm text-gray-600">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>


            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-[1.02] transition duration-200"
            >
              Create Account
            </button>

          </form>



          {/* Divider */}

          <div className="flex items-center my-5">

            <div className="flex-grow border-t"></div>

            <span className="mx-3 text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-grow border-t"></div>

          </div>



          {/* Google Button */}

          <button
            type="button"
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-gray-50 transition transform hover:scale-[1.02]"
          >

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />

            Continue with Google

          </button>



          {/* Login Redirect */}

          <p className="text-sm text-center text-gray-500 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login here
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
}

export default Register;