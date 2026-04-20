// pages/AuctionDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [customBid, setCustomBid] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // ⏳ countdown
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (product.auctionEnd) {
        const diff = new Date(product.auctionEnd) - new Date();

        if (diff <= 0) {
          setTimeLeft("Auction Ended");
          setIsEnded(true);
        } else {
          // Calculate days, hours, minutes, and seconds
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diff / (1000 * 60)) % 60);
          const s = Math.floor((diff / 1000) % 60);

          const daysText = days > 0 ? `${days}d ` : "";
          setTimeLeft(`${daysText}${h}h ${m}m ${s}s`);
          setIsEnded(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  const loadProduct = async () => {
    try {
      const res = await API.get(`/api/auction/${id}`);
      setProduct(res.data);
      setSelectedImage(res.data.images?.[0] || "");

      if (res.data.sellerEmail) {
        const sellerRes = await API.get(`/api/auth/profile/${res.data.sellerEmail}`);
        setSeller(sellerRes.data);
      }
    } catch (err) {
      console.error("Failed to load product details", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 BID FUNCTIONS
  const placeIncrementBid = async () => {
    const amount = (product.currentBid || product.baseBidPrice) + (product.bidIncrement || 1);
    await sendBid(amount);
  };

  const placeCustomBid = async () => {
    const min = (product.currentBid || product.baseBidPrice) + (product.bidIncrement || 1);

    if (Number(customBid) < min) {
      alert(`Bid must be at least ₹${min.toLocaleString('en-IN')}`);
      return;
    }

    await sendBid(Number(customBid));
    setCustomBid(""); // Clear input after successful bid
  };

  const sendBid = async (amount) => {
    if (!user) {
      alert("Please log in to place a bid.");
      return;
    }

    try {
      await API.post("/api/auction/bid", null, {
        params: {
          productId: id,
          email: user.email,
          amount: Number(amount)
        }
      });

      alert("✅ Bid placed successfully!");
      loadProduct(); // Refresh data to show new bid
    } catch (err) {
      alert(err.response?.data || "Bid failed");
    }
  };

  // 🛒 BUY FUNCTION (FIXED PRODUCT)
const buyNow = async () => {
  if (!user) {
    alert("Please log in to buy.");
    return;
  }
console.log(product);
  try {
    await API.post("/api/products/buy", null, {
      params: {
        productId: id,
        buyerEmail: user.email
      }
    });

    alert("✅ Purchase initiated!");
    loadProduct();
  } catch (err) {
    alert(err.response?.data || "Purchase failed");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-75"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ================= LEFT: IMAGE GALLERY ================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* MAIN IMAGE WRAPPER */}
            <div className="relative w-full aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center p-6 group">
              {/* Subtle patterned backdrop */}
              <div className="absolute inset-0 bg-slate-50 opacity-50 z-0"></div>
              
              <img
                src={selectedImage || "https://via.placeholder.com/600x400?text=No+Image+Available"}
                alt={product.title}
                className="max-w-full max-h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Top Left Badges overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm w-max">
                  {product.category}
                </span>
                <span className="bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm w-max">
                  {product.condition} Condition
                </span>
              </div>
            </div>

            {/* THUMBNAILS */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 transition-all duration-200 ${
                      selectedImage === img ? "border-blue-600 shadow-md scale-105" : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`thumbnail-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* DESCRIPTION BOX (Moves below images on large screens) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || "No description provided by the seller."}
              </p>
            </div>
          </div>

          {/* ================= RIGHT: DETAILS & ACTIONS ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* HEADER & PRICING */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.title}
              </h1>

              {/* TIMER (ONLY FOR AUCTION) */}
{product.sellingType === "auction" && (
<div className={`flex items-center gap-2 inline-flex px-4 py-2 rounded-xl mb-6 font-semibold shadow-sm ${isEnded ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600 border border-red-100'}`}>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  {timeLeft}
</div>
)}

              {/* PRICING */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">
  {product.sellingType === "auction" ? "Current Highest Bid" : "Price"}
</p>
                <div className="flex items-end gap-3 mb-2">
                  <h2 className="text-4xl font-black text-gray-900">
                    ₹{product.sellingType === "auction"
  ? (product.currentBid || product.baseBidPrice)?.toLocaleString('en-IN')
  : product.price?.toLocaleString('en-IN')}
                  </h2>
                </div>
                {product.sellingType === "auction" && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Base Price: <span className="font-semibold text-gray-800">₹{product.baseBidPrice?.toLocaleString('en-IN')}</span></p>
                  <p className="text-sm text-gray-500">Highest Bidder: <span className="font-semibold text-blue-600">{product.highestBidder || "None"}</span></p>
                </div>
                )}
              </div>

              {/* BIDDING ACTIONS */}
              {product.sellingType === "auction" && !isEnded && (

                <div className="mt-6 space-y-4">
                  <button
                    onClick={placeIncrementBid}
                    className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-lg"
                  >
                    Quick Bid (+₹{product.bidIncrement || 1})
                  </button>

                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR PLACE CUSTOM BID</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                      <input
                        type="number"
                        placeholder={`Min ₹${(product.currentBid || product.baseBidPrice) + (product.bidIncrement || 1)}`}
                        value={customBid}
                        onChange={(e) => setCustomBid(e.target.value)}
                        className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                    <button
                      onClick={placeCustomBid}
                      disabled={!customBid}
                      className="bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 text-white font-semibold px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AUCTION DETAILS GRID */}
            {product.sellingType === "auction" && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Auction Details</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Start Time</p>
                  <p className="font-medium text-gray-900">{product.auctionStart ? new Date(product.auctionStart).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">End Time</p>
                  <p className="font-medium text-gray-900">{product.auctionEnd ? new Date(product.auctionEnd).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Bid Increment</p>
                  <p className="font-medium text-gray-900">₹{product.bidIncrement || 1}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Item ID</p>
                  <p className="font-medium text-gray-900">#{id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
            )}                

            {/* ================= FIXED PRODUCT ACTION ================= */}
{product.sellingType === "fixed" && (
<div className="mt-6 space-y-4">

  {product.status === "LIVE" && (
    <button
      onClick={buyNow}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-lg"
    >
      Buy Now
    </button>
  )}

  {/* CONFIRMATION FLOW */}
  {product.status === "AWAITING_CONFIRMATION" && (
    <div className="flex gap-3">

      {user?.email === product.sellerEmail && !product.sellerConfirmed && (
        <button
          onClick={async ()=>{
            await API.post("/api/transaction/seller-confirm", null, {
              params:{ productId:id }
            });
            loadProduct();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Confirm Sold
        </button>
      )}

      {user?.email === product.buyerEmail && !product.buyerConfirmed && (
        <button
          onClick={async ()=>{
            await API.post("/api/transaction/buyer-confirm", null, {
              params:{ productId:id }
            });
            loadProduct();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Confirm Received
        </button>
      )}

    </div>
  )}

</div>
)}

            {/* SELLER CARD */}
            {seller.email && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5">
                <img
                  src={
                    seller.profilePictureUrl
                      ? `http://localhost:8080/${seller.profilePictureUrl.split("8080/")[1]}`
                      : `https://ui-avatars.com/api/?name=${seller.name || 'Seller'}&background=0D8ABC&color=fff`
                  }
                  alt="Seller"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                />
                
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seller Information</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{seller.name || "Unknown Seller"}</h3>
                  
                  <div className="space-y-1.5 text-sm text-gray-600">
                    {seller.city && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {seller.city}, {seller.state}
                      </p>
                    )}
                    {seller.phone && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {seller.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      {seller.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductDetails;