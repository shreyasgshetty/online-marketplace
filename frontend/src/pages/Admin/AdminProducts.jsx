import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await adminApi.get("/api/admin/products");
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const removeProduct = async (id) => {
    await adminApi.delete(`/api/admin/products/${id}`);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Product Moderation</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Seller</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.title}</td>
                <td className="p-3">{product.sellerEmail}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded text-xs bg-slate-100">
                    {product.moderationStatus || "PENDING"}
                  </span>
                </td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="px-2 py-1 rounded bg-red-100 text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
