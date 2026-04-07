import React, { useState } from "react";
import API from "../services/api";
import { 
  Plus, X, Tag, Layers, Briefcase, Info, 
  IndianRupee, Gavel, Calendar, CheckCircle2, 
  Image as ImageIcon, UploadCloud, Sparkles, 
  ShieldCheck, ArrowRight,
  Banknote
} from "lucide-react";
import Navbar from "../components/Navbar";

function SellProduct() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [sellingType, setSellingType] = useState("fixed");
  const [price, setPrice] = useState("");
  const [baseBidPrice, setBaseBidPrice] = useState("");
  const [auctionStart, setAuctionStart] = useState("");
  const [auctionEnd, setAuctionEnd] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  

  const uploadImages = async (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setIsUploading(true);
    const urls = [...images];
    try {
      for (let file of files) {
        if (urls.length >= 10) break;
        const formData = new FormData();
        formData.append("file", file);
        const res = await API.post("/api/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        urls.push(res.data);
      }
      setImages(urls);
    } catch (error) {
      alert("Error uploading images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const submitProduct = async () => {
    const product = {
      sellerEmail: user.email,
      title, category, brand, condition, description,
      images,
      tags: tags.split(",").map(tag => tag.trim()),
      sellingType,
      price: sellingType === "fixed" ? price : null,
      baseBidPrice: sellingType === "auction" ? baseBidPrice : null,
      auctionStart, auctionEnd,
      negotiable,
      city: user.city,
      state: user.state
    };

    try {
      await API.post("/api/products/sell", product);
      alert("✨ Your product is now live!");
      window.location.reload();
    } catch (err) {
      alert("Listing failed. Let's try that again.");
    }
  };

  return (
  <>
  <Navbar/>
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="relative max-w-[1400px] mx-auto py-12 px-6">
        
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3">
            <Sparkles size={16} />
            Marketplace Creator
          </div>
          <h1 className="text-5xl font-black text-slate-900">Showcase Your Item</h1>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl">
            Give your belongings a second story. Fill in the details below to attract the perfect buyer.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: LIVE PREVIEW CARD */}
          <div className="lg:col-span-4 sticky top-12 self-start space-y-6 hidden lg:block">
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-2 border border-white shadow-2xl">
              <div className="aspect-[4/5] bg-slate-100 rounded-[1.6rem] overflow-hidden relative">
                {images.length > 0 ? (
                  <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <ImageIcon size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-sm">Upload a photo to see your listing come to life here.</p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg">
                  <h3 className="font-bold text-slate-800 truncate">{title || "Listing Title"}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-indigo-600 font-bold text-lg">
                      {sellingType === 'fixed' ? `Rs ${price || '0'}` : 'Bidding Starts'}
                    </span>
                    <span className="text-[10px] px-2 py-1 bg-slate-100 rounded-full uppercase tracking-tighter font-bold text-slate-500">
                      {condition || "Condition"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
               <ShieldCheck className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10" />
               <h4 className="font-bold text-xl mb-2">Seller Protection</h4>
               <p className="text-indigo-100 text-sm leading-relaxed">
                 Every listing is encrypted and monitored for your safety. We've got your back.
               </p>
            </div>
          </div>

          {/* RIGHT COLUMN: THE FORM */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Visual Section: Images */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Visuals</h2>
                <p className="text-slate-400 text-sm mt-1">First impressions matter. Use clear, bright photos.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-3xl overflow-hidden shadow-md">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => removeImage(i)} className="bg-white p-2 rounded-full text-red-500 shadow-xl">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {images.length < 10 && (
                  <label 
                    htmlFor="img-upload"
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-indigo-100 rounded-3xl hover:bg-indigo-50/50 hover:border-indigo-300 cursor-pointer transition-all group"
                >
                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                      {isUploading ? <div className="animate-spin border-2 border-indigo-500 border-t-transparent rounded-full w-5 h-5" /> : <Plus size={24} />}
                    </div>
                  </label>
                )}
              </div>
              <input type="file" multiple className="hidden" id="img-upload" onChange={uploadImages} />
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
               <h2 className="text-2xl font-bold text-slate-800 mb-8">Tell the Story</h2>
               
               <div className="space-y-6">
                  <div className="group">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Listing Title</label>
                    <input 
                      placeholder="e.g. Vintage 1970s Film Camera" 
                      value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="space-y-2">
<label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
Category
</label>

<select
value={category}
onChange={(e) => setCategory(e.target.value)}
className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none"
>
<option value="">Select the category</option>
<option>Electronics</option>
<option>Automobile</option>
<option>Home</option>
<option>Books</option>
<option>Sports</option>
<option>Fashion</option>
</select>
</div>

<div className="space-y-2">
<label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
Brand
</label>

<input
placeholder="Who made it?"
value={brand}
onChange={(e) => setBrand(e.target.value)}
className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none"
/>
</div>

<div className="space-y-2">
<label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
Condition
</label>

<select
value={condition}
onChange={(e) => setCondition(e.target.value)}
className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none"
>
<option value="">Select Condition</option>
<option>New</option>
<option>Like New</option>
<option>Good</option>
<option>Used</option>
<option>Refurbished</option>
</select>
</div>

</div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Description</label>
                    <textarea 
                      rows="5" placeholder="Dimensions, history, special features..." 
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 p-6 rounded-3xl border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
                    />

                    <div className="space-y-2">
<label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
Tags
</label>

<input
  placeholder="e.g. iphone, mobile, apple (comma separated)"
  value={tags}
  onChange={(e) => setTags(e.target.value)}
  className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
/>

<p className="text-xs text-slate-400 ml-1">
Use tags to help buyers find your product faster.
</p>
<div className="flex flex-wrap gap-2 mt-3">
{tags.split(",").filter(tag => tag.trim() !== "").map((tag,i)=>(
<span key={i} className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
#{tag.trim()}
</span>
))}
</div>
</div>
                  </div>
               </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Value & Exchange</h2>
              
              <div className="flex p-1.5 bg-slate-100 rounded-3xl mb-10 w-fit">
                <button 
                  onClick={() => setSellingType("fixed")}
                  className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${sellingType === 'fixed' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Fixed Price
                </button>
                <button 
                  onClick={() => setSellingType("auction")}
                  className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${sellingType === 'auction' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Live Auction
                </button>
              </div>

              {sellingType === "fixed" ? (
                <div className="flex flex-col md:flex-row gap-6 items-end animate-in fade-in duration-500">
                  <div className="flex-1 space-y-2 w-full">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Set Your Price</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-6 top-5 text-indigo-400" size={20} />
                      <input 
                        type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 rounded-2xl bg-indigo-50/30 border-2 border-indigo-100 focus:border-indigo-500 outline-none text-2xl font-bold text-indigo-600"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-indigo-100 cursor-pointer transition-all">
                    <input type="checkbox" checked={negotiable} onChange={() => setNegotiable(!negotiable)} className="w-5 h-5 accent-indigo-600" />
                    <span className="font-bold text-slate-700 text-sm">Allow Negotiation</span>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Opening Bid</label>
                    <input type="number" value={baseBidPrice} onChange={(e) => setBaseBidPrice(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Starts</label>
                    <input type="datetime-local" value={auctionStart} onChange={(e) => setAuctionStart(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Ends</label>
                    <input type="datetime-local" value={auctionEnd} onChange={(e) => setAuctionEnd(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none text-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
              <div className="text-slate-400 text-sm italic">
                Step 3 of 3: Ready to go live!
              </div>
              <button 
                onClick={submitProduct}
                className="group relative w-full sm:w-auto overflow-hidden bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Launch Listing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}

export default SellProduct;