import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Wallet() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadBalance();
    loadHistory();
  }, []);

  const loadBalance = async () => {
    try {
      const res = await API.get(`/api/wallet/balance/${user.email}`);
      setBalance(res.data);
    } catch (err) {
      console.error("Failed to load balance", err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await API.get(`/api/withdraw/user/${user.email}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const res = await API.post("/api/payment/create-order", null, {
        params: { amount }
      });

      const order = res.data;

      const options = {
        key: "rzp_test_Sdr6ZGzf8Q4OUr",
        amount: order.amount,
        currency: "INR",
        name: "Marketplace Wallet",
        description: "Add Money to Wallet",
        order_id: order.id,

        handler: async function () {
          await API.post("/api/payment/success", null, {
            params: {
              email: user.email,
              amount
            }
          });

          alert("✅ Payment Successful");
          setAmount("");
          loadBalance();
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment initiation failed.");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !account || !ifsc || !holder) {
      alert("Please fill all withdrawal details");
      return;
    }

    if (Number(withdrawAmount) > balance) {
      alert("Insufficient balance in your wallet.");
      return;
    }

    try {
      await API.post("/api/withdraw/request", null, {
        params: {
          email: user.email,
          amount: withdrawAmount,
          acc: account,
          ifsc: ifsc,
          holder: holder
        }
      });

      alert("✅ Withdrawal request sent successfully");
      setWithdrawAmount("");
      setAccount("");
      setIfsc("");
      setHolder("");
      
      loadBalance();
      loadHistory();
    } catch (err) {
      alert("Failed to send withdrawal request.");
    }
  };

  // Helper for status colors
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "SUCCESS":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">APPROVED</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">REJECTED</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">{status || "PENDING"}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Wallet
          </h1>
          <p className="mt-2 text-gray-500">Manage your funds, add money, and withdraw to your bank.</p>
        </div>

        {/* TOP SECTION: BALANCE & ADD MONEY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* BALANCE CARD */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]">
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-blue-500 opacity-20 blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  <h2 className="text-sm font-medium uppercase tracking-wider">Available Balance</h2>
                </div>
                <p className="text-4xl sm:text-5xl font-black mt-1">
                  ₹{balance?.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="relative z-10 mt-6">
                <p className="text-sm text-gray-400">Linked to {user?.email}</p>
              </div>
            </div>
          </div>

          {/* ADD MONEY CARD */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add Money to Wallet
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">₹</span>
                <input
                  type="number"
                  placeholder="Enter amount to add"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-lg font-medium"
                />
              </div>
              <button
                onClick={handlePayment}
                disabled={!amount}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Proceed to Pay
              </button>
            </div>
            
            <div className="mt-4 flex gap-2">
              {[500, 1000, 2000, 5000].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: WITHDRAW & HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* WITHDRAW MONEY FORM */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-max">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              Withdraw Funds
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e)=>setWithdrawAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Account Holder Name</label>
                <input 
                  type="text"
                  placeholder="John Doe"
                  value={holder}
                  onChange={(e)=>setHolder(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Account Number</label>
                  <input 
                    type="text"
                    placeholder="1234567890"
                    value={account}
                    onChange={(e)=>setAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">IFSC Code</label>
                  <input 
                    type="text"
                    placeholder="SBIN0001234"
                    value={ifsc}
                    onChange={(e)=>setIfsc(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all uppercase"
                  />
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                className="w-full mt-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
              >
                Submit Request
              </button>
            </div>
          </div>

          {/* WITHDRAWAL HISTORY */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Withdrawal History
            </h2>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-gray-500 font-medium">No transactions found</p>
                <p className="text-sm text-gray-400 mt-1">Your withdrawal history will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((h, index) => (
                  <div key={h.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/50 gap-4">
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">₹{h.amount?.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-gray-500 font-medium">Bank Transfer</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2">
                      {getStatusBadge(h.status)}
                      {h.status === "REJECTED" && h.rejectionReason && (
                        <p className="text-xs text-red-500 font-medium max-w-[200px] text-left sm:text-right">
                          Note: {h.rejectionReason}
                        </p>
                      )}
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Wallet;