import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

const navigate = useNavigate();

return (

<div
onClick={() => navigate(`/product/${product.id}`)}
className="cursor-pointer bg-white p-3 shadow rounded hover:shadow-lg transition"
>

<img
src={product.images?.[0]}
className="h-40 w-full object-cover rounded"
/>

<h3 className="mt-2 font-semibold">
{product.title}
</h3>

<p className="text-green-600 font-bold">
₹ {product.price || product.currentBid}
</p>

</div>

);

}

export default ProductCard;