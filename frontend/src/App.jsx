import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import FinanceDashboard from "./pages/FinanceManager/FinanceDashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SellProduct from "./pages/SellProduct";
import Auction from "./pages/Auction";
import ProductDetails from "./pages/ProductDetails";
import Wallet from "./pages/Wallet";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminBanners from "./pages/Admin/AdminBanners";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";
import AdminLayout from "./components/admin/AdminLayout";
import FinanceWithdrawals from "./pages/FinanceManager/FinanceWithdrawals";
import UserDashboard from "./pages/UserDashboard";

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
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/finance/withdrawals" element={<FinanceWithdrawals />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
