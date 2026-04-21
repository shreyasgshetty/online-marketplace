function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse h-full">
      {/* Image Skeleton */}
      <div className="aspect-square w-full bg-slate-200"></div>

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title lines */}
        <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-2/3 mb-6"></div>

        {/* Price & Action Button Skeleton */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between">
          <div>
            <div className="h-3 bg-slate-200 rounded w-10 mb-2"></div>
            <div className="h-6 bg-slate-200 rounded w-20"></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;