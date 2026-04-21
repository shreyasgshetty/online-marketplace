import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

function ProductGrid({ products, loadMore, hasMore = true }) {
  return (
    <InfiniteScroll
      dataLength={products?.length || 0}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      }
      className="overflow-visible" // Prevents cutting off hover shadows
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id || i} product={p} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default ProductGrid;