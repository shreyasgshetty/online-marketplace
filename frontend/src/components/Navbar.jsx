import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  ChevronDown,
  Menu,
  X,
  ShoppingBag
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("user");   // remove user object
  localStorage.removeItem("email");  // optional (if used)

  setProfileOpen(false);

  navigate("/login");
};

  return (

    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-100 shadow-sm">

      <div className="w-full flex items-center justify-between px-8 lg:px-14 py-3">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-blue-600 hover:scale-[1.02] transition"
        >
          <ShoppingBag className="w-6 h-6 text-blue-600" />
          Online-Marketplace
        </Link>



        {/* Desktop Navigation */}

        <div className="hidden lg:flex items-center gap-10 text-[15px] font-semibold text-gray-600">

          {["Electronics","Automobile","Home","Books","Sports","Fashion"].map((item)=>(
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="relative group transition"
            >

              <span className="group-hover:text-blue-600 transition">
                {item}
              </span>

              {/* animated underline */}

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>

            </Link>
          ))}

        </div>



        {/* Search */}

        <div className="hidden md:flex relative w-[340px]">

          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />

          <Search className="absolute left-4 top-[10px] w-4 h-4 text-gray-400" />

        </div>



        {/* Right Section */}

        <div className="flex items-center gap-5">


          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="p-2 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Heart className="w-5 h-5"/>
          </Link>



          {/* Sell Button */}

          <Link
            to="/sell"
            className="hidden sm:block text-sm font-semibold text-white bg-blue-600 px-5 py-2 rounded-full shadow hover:bg-blue-700 hover:shadow-md transition"
          >
            Sell Product
          </Link>



          {/* Profile */}

          <div className="relative">

            <button
              onClick={() => {
              const user = localStorage.getItem("user");
                          
              if (!user) {
                navigate("/login");
              } else {
                setProfileOpen(!profileOpen);
              }
            }}
              className="flex items-center gap-2 p-1 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition"
            >

              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {JSON.parse(localStorage.getItem("user"))?.name?.charAt(0) || "U"}
              </div>

              <ChevronDown className="w-4 h-4 text-gray-400"/>

            </button>



            {profileOpen && (

              <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 shadow-xl rounded-xl p-2 animate-fade">

                {["Profile","Wallet","Dashboard"].map((item)=>(
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                  >
                    {item}
                  </Link>
                ))}

                <div className="border-t my-2"/>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>

              </div>

            )}

          </div>



          {/* Mobile Toggle */}

          <button
            onClick={()=>setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
          >
            {mobileOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>

        </div>

      </div>



      {/* Mobile Menu */}

      {mobileOpen && (

        <div className="lg:hidden bg-white border-t animate-slide">

          <div className="flex flex-col px-8 py-6 gap-4 text-gray-700 font-medium">

            {["Electronics","Automobile","Home","Books","Sports","Fashion"].map((item)=>(
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-blue-600 transition"
              >
                {item}
              </Link>
            ))}

            <div className="border-t my-2"/>

            <Link to="/wishlist">Wishlist</Link>
            <Link to="/sell">Sell Product</Link>

          </div>

        </div>

      )}

    </nav>

  );
}

export default Navbar;