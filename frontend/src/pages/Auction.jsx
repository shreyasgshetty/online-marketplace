// pages/Auction.jsx

import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LiveTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (!endTime) return { text: "No time limit", urgent: false };
      
      const diff = new Date(endTime) - new Date();
      if (diff <= 0) return { text: "Auction Ended", urgent: false };

      // Calculate days, hours, minutes, and seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      // Only display days if there is 1 or more days left
      const daysText = days > 0 ? `${days}d ` : "";

      return {
        text: `${daysText}${hours}h ${mins}m ${secs}s left`,
        urgent: days === 0 && hours < 1 // Becomes urgent if less than 1 hour left total
      };
    };

    const timer = setInterval(() => {
      const { text, urgent } = calculateTime();
      setTimeLeft(text);
      setIsUrgent(urgent);
    }, 1000);

    // Initial call
    const initial = calculateTime();
    setTimeLeft(initial.text);
    setIsUrgent(initial.urgent);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft === "Auction Ended") {
    return (
      <div className="absolute top-3 left-3 bg-gray-800/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
        Ended
      </div>
    );
  }

  return (
    <div className={`absolute top-3 left-3 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition-colors ${isUrgent ? 'bg-red-600/90 animate-pulse' : 'bg-black/60'}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {timeLeft}
    </div>
  );
};

function Auction() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate slight network delay for the skeleton loader to show smoothly
    API.get("/api/auction")
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Failed to fetch auctions:", err))
      .finally(() => setLoading(false));
  }, []);

  // ❌ REMOVE EXPIRED AUCTIONS
  const activeProducts = products.filter(p =>
    p.auctionEnd && new Date(p.auctionEnd) > new Date()
  );

  // 🔍 FILTERS
  let filtered = activeProducts
    .filter(p => !category || p.category === category)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  // 🔃 SORTING
  if (sort === "low") {
    filtered.sort((a, b) => (a.currentBid || a.baseBidPrice) - (b.currentBid || b.baseBidPrice));
  } else if (sort === "high") {
    filtered.sort((a, b) => (b.currentBid || b.baseBidPrice) - (a.currentBid || a.baseBidPrice));
  } else if (sort === "ending") {
    filtered.sort((a, b) => new Date(a.auctionEnd) - new Date(b.auctionEnd));
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <Navbar />

      {/* HERO SECTION */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-8 mb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Discover Live Auctions
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl">
            Bid on exclusive electronics, fashion, and more. Find the best deals before time runs out.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row flex-wrap gap-4 mb-10 items-center justify-between">
          
          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex w-full md:w-auto gap-3">
            {/* CATEGORY */}
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 md:w-48 border border-gray-200 px-4 py-2.5 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-700"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
            </select>

            {/* SORT */}
            <select
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 md:w-48 border border-gray-200 px-4 py-2.5 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-gray-700"
            >
              <option value="">Sort By</option>
              <option value="ending">Ending Soon ⏳</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 w-full"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/auction/${p.id}`)}
                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden"
              >
                {/* IMAGE WRAPPER (Handles varying aspect ratios perfectly) */}
                <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={p.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={p.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <LiveTimer endTime={p.auctionEnd} />
                </div>

                {/* CONTENT */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
                      {p.title}
                    </h2>
                  </div>

                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-md w-max mb-4">
                    {p.category}
                  </span>

                  <div className="mt-auto">
                    <p className="text-gray-500 text-sm mb-1">Current Bid</p>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      ₹{(p.currentBid || p.baseBidPrice)?.toLocaleString('en-IN')}
                    </p>

                    <button className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-xl group-hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2">
                      Place Bid
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any active auctions matching your current filters. Try adjusting your search or category.
            </p>
            {(search || category) && (
              <button 
                onClick={() => { setSearch(""); setCategory(""); setSort(""); }}
                className="mt-6 text-blue-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Auction;