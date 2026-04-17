import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import FinanceDashboard from "./pages/FinanceManager/FinanceDashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SellProduct from "./pages/SellProduct";
<<<<<<< Updated upstream
import Auction from "./pages/Auction";
import AuctionDetails from "./pages/AuctionDetails";
import Wallet from "./pages/Wallet";
=======
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminBanners from "./pages/Admin/AdminBanners";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";
import AdminLayout from "./components/admin/AdminLayout";
>>>>>>> Stashed changes

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRouteGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="banners" element={<AdminBanners />} />
            </Route>
          </Route>
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sell" element={<SellProduct />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
