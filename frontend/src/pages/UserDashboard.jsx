import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("actions"); // Default tab
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get(`/api/dashboard/${user.email}`);
      setData(res.data);
      
      // Smart default tab routing based on pending actions
      const pendingCount = getPendingCount(res.data);
      if (pendingCount === 0) setActiveTab("bids");

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type }), 4000);
  };

  const getPendingCount = (dashboardData) => {
    if (!dashboardData) return 0;
    const sellerPending = dashboardData.soldProducts.filter(p => p.status === "AWAITING_CONFIRMATION" && !p.sellerConfirmed).length;
    const buyerPending = dashboardData.boughtProducts.filter(p => p.status === "AWAITING_CONFIRMATION" && !p.buyerConfirmed).length;
    return sellerPending + buyerPending;
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = getPendingCount(data);

  // 🔥 TAB NAVIGATION CONFIG
  const tabs = [
    { id: "actions", label: "Pending Actions", count: pendingCount, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-amber-500" },
    { id: "bids", label: "Active Bids", count: data.bids.length, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "text-indigo-500" },
    { id: "bought", label: "Purchases", count: data.boughtProducts.length, icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", color: "text-blue-500" },
    { id: "sold", label: "Sales", count: data.soldProducts.length, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-500" },
  ];

  // 🔥 COMMON CARD UI
  const ProductCard = ({ p }) => (
    <div
      onClick={() => navigate(`/product/${p.id}`)}
      className="group bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={p.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {p.status && (
          <div className="absolute top-4 left-4">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md border
              ${p.status === "COMPLETED" ? "bg-green-500/90 text-white border-green-400" : p.status === "AWAITING_CONFIRMATION" ? "bg-amber-500/90 text-white border-amber-400" : "bg-gray-900/80 text-white border-gray-700"}
            `}>
              {p.status.replace("_", " ")}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{p.category}</span>
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-4 leading-tight">{p.title}</h3>
        
        <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Final Amount</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">
              ₹{(p.price || p.currentBid)?.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ icon, title, message }) => (
    <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="bg-slate-50 p-6 rounded-full mb-6">
        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon}></path></svg>
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ================= DASHBOARD HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Hello, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="mt-3 text-lg text-gray-500 font-medium">
              Here is what's happening with your account today.
            </p>
          </div>
          
          {/* Quick Stats Summary Row */}
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-2 border-r border-gray-100 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Purchases</p>
              <p className="text-xl font-black text-gray-900">{data.boughtProducts.length}</p>
            </div>
            <div className="px-6 py-2 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sales</p>
              <p className="text-xl font-black text-gray-900">{data.soldProducts.length}</p>
            </div>
          </div>
        </div>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-8 flex overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : tab.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}></path>
              </svg>
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? "bg-white/20 text-white" 
                    : tab.id === "actions" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB CONTENT AREA ================= */}
        <div className="animate-fade-in-up">
          
          {/* TAB 1: PENDING ACTIONS */}
          {activeTab === "actions" && (
            <div>
              {pendingCount === 0 ? (
                <EmptyState icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" title="You're all caught up!" message="There are no pending actions required from you at the moment." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Seller Actions */}
                  {data.soldProducts.filter(p => p.status === "AWAITING_CONFIRMATION" && !p.sellerConfirmed).map(p => (
                    <div key={p.id} className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                      <div className="flex items-start gap-4 mb-4">
                        <img src={p.images?.[0] || "https://via.placeholder.com/100"} alt="Item" className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm" />
                        <div>
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 block">To Dispatch</span>
                          <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">{p.title}</h3>
                        </div>
                      </div>
                      <div className="bg-amber-50/50 rounded-xl p-4 mb-6 border border-amber-100">
                        <p className="text-sm text-gray-600 font-medium">Please dispatch the item and confirm to receive your payment of <strong className="text-gray-900">₹{(p.price - p.price * 0.025).toLocaleString('en-IN')}</strong>.</p>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await API.post("/api/transaction/seller-confirm", null, { params: { productId: p.id } });
                            showToast(`✅ Successfully confirmed dispatch!`, "success");
                            load();
                          } catch (err) {
                            showToast("Failed to confirm.", "error");
                          }
                        }}
                        className="mt-auto w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
                      >
                        Confirm Dispatch
                      </button>
                    </div>
                  ))}

                  {/* Buyer Actions */}
                  {data.boughtProducts.filter(p => p.status === "AWAITING_CONFIRMATION" && !p.buyerConfirmed).map(p => (
                    <div key={p.id} className="bg-white border border-blue-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                      <div className="flex items-start gap-4 mb-4">
                        <img src={p.images?.[0] || "https://via.placeholder.com/100"} alt="Item" className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm" />
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 block">Confirm Receipt</span>
                          <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">{p.title}</h3>
                        </div>
                      </div>
                      <div className="bg-blue-50/50 rounded-xl p-4 mb-6 border border-blue-100">
                        <p className="text-sm text-gray-600 font-medium">Confirm you have received the item to release the <strong className="text-gray-900">₹ {(p.price || p.currentBid || p.baseBidPrice)?.toLocaleString('en-IN')}</strong> hold on your wallet.</p>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await API.post("/api/transaction/buyer-confirm", null, { params: { productId: p.id } });
                            showToast(`📦 Item received! Funds released to seller.`, "success");
                            load();
                          } catch (err) {
                            showToast("Failed to confirm.", "error");
                          }
                        }}
                        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
                      >
                        Confirm Delivery
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE BIDS */}
          {activeTab === "bids" && (
            <div>
              {data.bids.length === 0 ? (
                <EmptyState icon="M13 10V3L4 14h7v7l9-11h-7z" title="No Active Bids" message="You are not currently bidding on any items. Head over to the auction page to discover deals." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.bids.map((b) => (
                    <div key={b.product.id} onClick={() => navigate(`/product/${b.product.id}`)} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      <div className="flex gap-4 items-center mb-5">
                        <img src={b.product.images?.[0] || "https://via.placeholder.com/150"} alt="product" className="h-20 w-20 object-cover rounded-2xl border border-gray-100 shadow-sm" />
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">{b.product.title}</h3>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 mt-auto border border-slate-100">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Your Highest Bid</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-black text-gray-900">₹{b.userBid?.toLocaleString("en-IN")}</p>
                          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 ${b.status === "WINNING" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${b.status === "WINNING" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PURCHASES */}
          {activeTab === "bought" && (
            <div>
              {data.boughtProducts.length === 0 ? (
                <EmptyState icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" title="No purchases yet" message="When you win an auction and complete the transaction, the item will appear here." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {data.boughtProducts.map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SALES */}
          {activeTab === "sold" && (
            <div>
              {data.soldProducts.length === 0 ? (
                <EmptyState icon="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" title="No sales yet" message="Items you successfully auction off will be logged in this history." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {data.soldProducts.map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* FLOATING TOAST NOTIFICATION */}
      {toast.visible && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border flex items-center gap-3 z-50 transition-all duration-300 animate-fade-in-up ${
          toast.type === "success" ? "bg-gray-900 border-gray-800 text-white" : "bg-red-500 border-red-600 text-white"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          )}
          <p className="font-bold tracking-wide text-sm">{toast.message}</p>
        </div>
      )}

      {/* Inline Animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      `}} />

    </div>
  );
}

export default UserDashboard;