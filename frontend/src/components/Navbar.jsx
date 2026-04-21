import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Gavel,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  User,
  Wallet,
  LayoutDashboard,
  LogOut,
  Plus,
  Grid
} from "lucide-react";

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const categories = ["Electronics", "Automobile", "Home", "Books", "Sports", "Fashion"];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans shadow-sm">
      
      {/* ================= TIER 1: MAIN NAVBAR ================= */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            
            {/* 1. LOGO */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors hidden sm:block">
                Marketplace
              </span>
            </Link>

            {/* 2. SEARCH BAR (Expands to fill available space gracefully) */}
            <div className="flex-1 max-w-2xl hidden md:flex relative group">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full bg-gray-100/80 border border-transparent hover:border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>

            {/* 3. RIGHT ACTIONS */}
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Live Auctions */}
              <Link to="/auction" className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-semibold text-sm transition-colors group">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                  <Gavel className="w-5 h-5" />
                </div>
                Auctions
              </Link>

              {/* Sell Button */}
              <Link to="/sell" className="hidden sm:flex items-center gap-2 text-white bg-gray-900 hover:bg-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                Sell
              </Link>

              {/* Separator */}
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

              {/* User Profile / Login */}
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {currentUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl py-2 animate-fade-in-up z-50">
                      <div className="px-5 py-3 border-b border-gray-50 mb-2">
                        <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                      </div>

                      <div className="flex flex-col px-2">
                        <Link onClick={() => setProfileOpen(false)} to="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                          <User className="w-4 h-4 text-gray-400" /> My Profile
                        </Link>
                        <Link onClick={() => setProfileOpen(false)} to="/wallet" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                          <Wallet className="w-4 h-4 text-gray-400" /> Wallet Balance
                        </Link>
                        <Link onClick={() => setProfileOpen(false)} to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2 mx-3"></div>
                        
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                          <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-6 py-2.5 rounded-xl transition-colors">
                  Log In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TIER 2: CATEGORIES (Desktop Only) ================= */}
      <div className="hidden lg:block w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-12">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 pr-6 border-r border-gray-200">
              <Grid className="w-4 h-4" />
              Categories
            </div>
            
            <div className="flex items-center gap-8">
              {categories.map((item) => (
                <Link
                  key={item}
                  to={`/category/${item.toLowerCase()}`}
                  className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU SLIDE-DOWN ================= */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-xl absolute w-full animate-fade-in-down z-40">
          <div className="flex flex-col px-4 py-6 max-h-[85vh] overflow-y-auto">
            
            {/* Mobile Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-base focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Navigation</p>
            
            <Link onClick={() => setMobileOpen(false)} to="/auction" className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors">
              <Gavel className="w-5 h-5 text-indigo-500" /> Live Auctions
            </Link>
            <Link onClick={() => setMobileOpen(false)} to="/sell" className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition-colors mb-4">
              <Plus className="w-5 h-5 text-gray-900" /> Sell a Product
            </Link>

            <div className="border-t border-gray-100 mb-4 mx-2" />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((item) => (
                <Link
                  key={item}
                  to={`/category/${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.2s ease-out forwards; }
      `}} />
    </header>
  );
}

export default Navbar;