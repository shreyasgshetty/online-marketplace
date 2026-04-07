import { Heart } from "lucide-react";

function ProductCard({ product }) {

return (

<div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 w-[220px]">

<div className="relative">

<img
src={product.images[0]}
className="h-40 w-full object-cover rounded-lg"
/>

<button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
<Heart size={16}/>
</button>

</div>

<h3 className="font-semibold mt-3 truncate">
{product.title}
</h3>

<p className="text-sm text-gray-500">
{product.category}
</p>

<p className="text-indigo-600 font-bold mt-1">
₹{product.price || product.baseBidPrice}
</p>

</div>

);

}

export default ProductCard;