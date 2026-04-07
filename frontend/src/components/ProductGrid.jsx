import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

function ProductGrid({products,loadMore}){

return(

<InfiniteScroll
dataLength={products.length}
next={loadMore}
hasMore={true}
loader={<ProductSkeleton/>}
>

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

{products.map((p,i)=>(
<ProductCard key={i} product={p}/>
))}

</div>

</InfiniteScroll>

);

}

export default ProductGrid;