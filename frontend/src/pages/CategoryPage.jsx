import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { MapPin, ArrowUpDown, Tag, Gavel, PackageX } from "lucide-react";

function CategoryPage() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    // Reset filters when category changes
    setCity("");
    setSort("");
    setLoading(true);
    loadProducts();
  }, [category]);

  // 🔥 LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await API.get("/api/products");
      const categoryProducts = res.data.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );

      // Dynamically extract unique cities from the available products
      const cities = Array.from(new Set(categoryProducts.map(p => p.city).filter(Boolean)));
      
      setAvailableCities(cities);
      setProducts(categoryProducts);
      setFiltered(categoryProducts);
    } catch (err) {
      console.error("Failed to load category products", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTER + SORT
  useEffect(() => {
    let temp = [...products];

    // CITY FILTER
    if (city) {
      temp = temp.filter((p) => p.city === city);
    }

    // SORT
    if (sort === "low") {
      temp.sort((a, b) => (a.price || a.currentBid || 0) - (b.price || b.currentBid || 0));
    }
    if (sort === "high") {
      temp.sort((a, b) => (b.price || b.currentBid || 0) - (a.price || a.currentBid || 0));
    }
    if (sort === "latest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFiltered(temp);
  }, [city, sort, products]);

  // 🔥 SPLIT TYPES
  const fixedProducts = filtered.filter(
    (p) => p.sellingType?.toLowerCase() === "fixed" && (p.status === "AVAILABLE" || p.status === "LIVE")
  );

  const auctionProducts = filtered.filter(
    (p) => p.sellingType?.toLowerCase() === "auction" && p.status === "LIVE" && new Date(p.auctionEnd) > new Date()
  );

  // Helper to capitalize category
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white pt-16 pb-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3">Explore Category</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* ================= FILTER BAR ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center mb-12 relative z-10">
          
          <div className="text-sm font-bold text-gray-500 w-full sm:w-auto">
            Showing results for <span className="text-gray-900">"{categoryName}"</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* City Dropdown */}
            <div className="relative group">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer transition-all"
              >
                <option value="">All Locations</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-48 appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer transition-all"
              >
                <option value="">Sort By Relevance</option>
                <option value="latest">Newest First</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <ProductSkeleton key={n} />
            ))}
          </div>
        ) : (
          <>
            {/* ================= AUCTION PRODUCTS (Prioritized) ================= */}
            {auctionProducts.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-xl text-red-600">
                      <Gavel className="w-6 h-6" />
                    </div>
                    Live Auctions
                    <span className="relative flex h-3 w-3 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {auctionProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* ================= FIXED PRICE PRODUCTS ================= */}
            {fixedProducts.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                      <Tag className="w-6 h-6" />
                    </div>
                    Buy It Now
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {fixedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* ================= EMPTY STATE ================= */}
            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 py-24 px-4 text-center shadow-sm">
                <div className="bg-gray-50 p-6 rounded-full mb-5">
                  <PackageX className="w-16 h-16 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 max-w-md">
                  We couldn't find any products in the "{categoryName}" category matching your current filters.
                </p>
                {(city || sort) && (
                  <button 
                    onClick={() => { setCity(""); setSort(""); }}
                    className="mt-6 text-blue-600 font-bold hover:text-blue-700 bg-blue-50 px-6 py-2.5 rounded-full transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;