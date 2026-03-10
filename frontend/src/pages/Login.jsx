import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { Toaster, toast } from "react-hot-toast";

function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [showPassword,setShowPassword] = useState(false);

const provider = new GoogleAuthProvider();

const login = async(e)=>{

e.preventDefault();

setLoading(true);

try{

const res = await API.post("/api/auth/login",{
email,
password
});

toast.success("Login successful 🎉",{
style:{borderLeft:"5px solid #3b82f6"}
});

setTimeout(()=>{
redirectUser(res.data.role);
},1000);

}catch(error){

toast.error("Invalid email or password",{
style:{borderLeft:"5px solid #ef4444"}
});

}

setLoading(false);

};

const googleLogin = async ()=>{

try{

const result = await signInWithPopup(auth,provider);

const user = result.user;

const res = await API.post("/api/auth/register",{

name:user.displayName,
email:user.email,
password:"GOOGLE_AUTH"

});

toast.success("Logged in with Google 🚀",{
style:{borderLeft:"5px solid #3b82f6"}
});

setTimeout(()=>{
redirectUser(res.data.role);
},1000);

}catch(error){

toast.error("Google login failed");

}

};

const redirectUser = (role)=>{

if(role === "USER"){

navigate("/");

}

else if(role === "ADMIN"){

navigate("/admin");

}

else if(role === "FINANCE_MANAGER"){

navigate("/finance");

}

};

return(

<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">

<Toaster
position="top-right"
toastOptions={{
style:{
background:"#ffffff",
color:"#1f2937",
borderRadius:"10px",
padding:"14px",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)",
border:"1px solid #e5e7eb"
}
}}
/>

{/* Main Title */}

<h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-6 animate-fade-in">
Online-Marketplace
</h1>

{/* Card */}

<div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">

{/* Left Panel */}

<div className="hidden md:flex md:w-1/2 bg-green-500 text-white p-10 flex-col justify-center">

<h2 className="text-4xl font-bold mb-4">
Welcome Back
</h2>

<p className="text-blue-100 text-lg leading-relaxed">
Login to access your account and continue exploring the marketplace.
Manage products, finances, and orders with ease.
</p>

</div>


{/* Right Panel */}

<div className="w-full md:w-1/2 p-8 md:p-10">

<h2 className="text-2xl font-bold text-gray-800 mb-2">
Sign In
</h2>

<p className="text-gray-500 mb-6">
Enter your credentials to access your account
</p>

<form onSubmit={login} className="space-y-4">

{/* Email */}

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


{/* Password */}

<div>

<label className="text-sm text-gray-600">
Password
</label>

<div className="relative">

<input
type={showPassword ? "text":"password"}
placeholder="Enter your password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-10"
required
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-4 text-gray-500 text-sm"
>

{showPassword ? "Hide":"Show"}

</button>

</div>

</div>


{/* Login Button */}

<button
type="submit"
className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition flex justify-center items-center"
>

{loading ? (

<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

):"Login"}

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


{/* Google Login */}

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


{/* Register Redirect */}

<p className="text-sm text-center text-gray-500 mt-6">

Don't have an account?{" "}

<Link
to="/register"
className="text-green-500 font-semibold hover:underline"
>
Create one
</Link>

</p>

</div>

</div>

</div>

)

}

export default Login;