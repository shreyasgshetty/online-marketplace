import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Image as ImageIcon, 
  LogOut, 
  Store 
} from "lucide-react"; // Install lucide-react if you haven't: npm install lucide-react

// Enhanced link base with block behavior
const linkBase = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";

function AdminLayout() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR - Fixed width and high contrast */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 p-6 flex flex-col shrink-0">
        <div className="mb-10 px-2">
          <h1 className="text-white text-2xl font-bold tracking-tight">Admin<span className="text-blue-500">Panel</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => 
              `${linkBase} ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => 
              `${linkBase} ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <Users size={20} />
            Users
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => 
              `${linkBase} ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <Package size={20} />
            Products
          </NavLink>

          <NavLink
            to="/admin/banners"
            className={({ isActive }) => 
              `${linkBase} ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-800 hover:text-white"}`
            }
          >
            <ImageIcon size={20} />
            Banners
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 border-t border-slate-800 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <Store size={20} />
            Go to Store
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Welcome, {adminUser?.name || "System Admin"}
            </h2>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Manage platform operations
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;