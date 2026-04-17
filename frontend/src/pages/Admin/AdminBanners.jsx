import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Electronics");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const loadBanners = async () => {
    const res = await adminApi.get("/api/admin/banners");
    setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const uploadBanner = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tag", tag);

    await adminApi.post("/api/admin/banners/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setFile(null);
    setTitle("");
    setDescription("");
    setTag("");
    loadBanners();
  };

  const deleteBanner = async (id) => {
    await adminApi.delete(`/api/admin/banners/${id}`);
    loadBanners();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={uploadBanner} className="bg-white border rounded-xl p-4 grid md:grid-cols-2 gap-3">
        <h3 className="md:col-span-2 font-semibold text-lg">Upload New Banner</h3>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="border rounded p-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded p-2">
          <option>Electronics</option>
          <option>Automobile</option>
          <option>Home</option>
          <option>Books</option>
          <option>Sports</option>
          <option>Fashion</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border rounded p-2" />
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" className="border rounded p-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="md:col-span-2 border rounded p-2" />
        <button className="md:col-span-2 bg-blue-600 text-white rounded p-2">Upload Banner</button>
      </form>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Existing Banners</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-lg overflow-hidden">
              <img src={banner.imageUrl} alt={banner.title} className="h-36 w-full object-cover" />
              <div className="p-3">
                <p className="font-semibold text-sm">{banner.title || "Untitled"}</p>
                <p className="text-xs text-slate-500">{banner.redirectCategory}</p>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="mt-2 px-2 py-1 rounded bg-red-100 text-red-700 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminBanners;
