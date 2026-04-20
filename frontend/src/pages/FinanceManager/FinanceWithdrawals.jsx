import { useEffect, useState } from "react";
import API from "../../services/api";

function FinanceWithdrawals() {
  const [data, setData] = useState([]);
  const [reasons, setReasons] = useState({});
  const [rejectingId, setRejectingId] = useState(null); // Tracks which item is being rejected
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/api/withdraw/all");
      setData(res.data);
    } catch (err) {
      showToast("Failed to load requests", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type }), 3000);
  };

  // ✅ Handle approve
  const approve = async (id) => {
    try {
      await API.post("/api/withdraw/approve", null, {
        params: { id }
      });

      setData(prev => prev.filter(w => w.id !== id));
      showToast("Withdrawal approved successfully!", "success");
    } catch (err) {
      showToast("Approval failed. Please try again.", "error");
    }
  };

  // ✅ Handle reject confirm
  const confirmReject = async (id) => {
    const reason = reasons[id];

    if (!reason || reason.trim() === "") {
      showToast("Please enter a valid rejection reason", "error");
      return;
    }

    try {
      await API.post("/api/withdraw/reject", null, {
        params: { id, reason }
      });

      setData(prev => prev.filter(w => w.id !== id));
      setRejectingId(null); // Close the rejection UI
      showToast("Withdrawal rejected successfully.", "success");
    } catch (err) {
      showToast("Rejection failed. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 relative">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Withdrawal Requests
            {data.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                {data.length} Pending
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-2">Review and process user withdrawal requests.</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 py-24 shadow-sm">
          <div className="bg-green-50 p-6 rounded-full mb-4">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">All caught up!</h3>
          <p className="text-gray-500">There are no pending withdrawal requests at the moment.</p>
        </div>
      )}

      {/* REQUESTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map(w => (
          <div key={w.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all hover:shadow-md">
            
            {/* CARD HEADER */}
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Request from</p>
                  <p className="font-bold text-gray-900">{w.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-2xl font-black text-gray-900">₹{w.amount?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* BANK DETAILS */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Bank Details</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                  <p className="font-semibold text-gray-900">{w.accountHolder}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <p className="font-semibold text-gray-900">{w.bankAccount}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                  <p className="font-semibold text-gray-900 tracking-wide">{w.ifsc}</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS & REJECTION UI */}
            <div className="mt-auto">
              {rejectingId === w.id ? (
                // REJECTION INPUT UI (Shows when "Reject" is clicked)
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-in">
                  <label className="block text-sm font-medium text-red-800 mb-2">Reason for rejection:</label>
                  <textarea
                    placeholder="E.g., Invalid IFSC code, Suspicious activity..."
                    value={reasons[w.id] || ""}
                    onChange={(e) => setReasons({ ...reasons, [w.id]: e.target.value })}
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white mb-3 text-sm resize-none"
                    rows="2"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => confirmReject(w.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow-sm"
                    >
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // DEFAULT APPROVE/REJECT BUTTONS
                <div className="flex gap-4">
                  <button
                    onClick={() => approve(w.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Approve Transfer
                  </button>
                  
                  <button
                    onClick={() => setRejectingId(w.id)}
                    className="flex-1 bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Reject
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* FLOATING TOAST NOTIFICATION */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 animate-fade-in-up z-50 ${
          toast.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ) : (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          )}
          <p className="font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Adding a small inline style for the animations to make it pop */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}} />

    </div>
  );
}

export default FinanceWithdrawals;