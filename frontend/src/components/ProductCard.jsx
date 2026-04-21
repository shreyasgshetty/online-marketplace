import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 h-full"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
            <p className="text-xl font-black text-gray-900 tracking-tight">
              ₹{(product.price || product.currentBid)?.toLocaleString('en-IN')}
            </p>
          </div>
          
          {/* Action Button (Visual only, click is handled by the card) */}
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 shadow-sm border border-gray-100 group-hover:border-blue-600">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;