import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/Navbar";

function FinanceDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get("/api/finance/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load finance stats", err);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HEADER & ACTION BUTTON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Finance Overview
            </h1>
            <p className="mt-2 text-gray-500 font-medium">
              Monitor platform revenue, user wallets, and withdrawal requests.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/finance/withdrawals")}
            className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
          >
            <svg className="w-5 h-5 text-blue-100 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Review Withdrawals
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. HERO METRIC: Total Wallet Balance */}
          <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-center min-h-[160px]">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-5 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-500 opacity-10 blur-xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-gray-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  Platform Wallet Reserve
                </h2>
                <p className="text-4xl sm:text-5xl font-black text-white">
                  ₹{stats.totalWallet?.toLocaleString('en-IN') || 0}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Total Transactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <h2 className="text-gray-500 font-bold tracking-wide">Total Transactions</h2>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mt-auto">
              {stats.totalTransactions?.toLocaleString() || 0}
            </p>
          </div>

          {/* 3. Pending Requests */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col relative overflow-hidden">
            {stats.pending > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-50 p-3 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-gray-500 font-bold tracking-wide">Pending Requests</h2>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mt-auto">
              {stats.pending || 0}
            </p>
          </div>

          {/* 4. Approved */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-gray-500 font-bold tracking-wide">Approved</h2>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mt-auto">
              {stats.approved || 0}
            </p>
          </div>

          {/* 5. Rejected */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-50 p-3 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-gray-500 font-bold tracking-wide">Rejected</h2>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mt-auto">
              {stats.rejected || 0}
            </p>
          </div>

          {/* 6. Platform Fee Earned */}
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-purple-50 p-3 rounded-xl">
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 8c-3 0-4 1.5-4 3s1 3 4 3 4 1.5 4 3-1 3-4 3m0-12v12" />
      </svg>
    </div>
    <h2 className="text-gray-500 font-bold tracking-wide">
      Platform Revenue (2.5%)
    </h2>
  </div>

  <p className="text-3xl font-extrabold text-gray-900 mt-auto">
    ₹{stats.totalPlatformFee?.toLocaleString('en-IN') || 0}
  </p>
</div>

        </div>
      </div>
    </div>
  );
}

export default FinanceDashboard;