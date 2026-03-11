import React, { useEffect, useState } from "react";
import API from "../services/api";
import { states } from "../data/locationData";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { 
  User, Mail, Phone, MapPin, Map as MapIcon, 
  Camera, Save, X, Globe, Building, ArrowLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper component for map clicks
function LocationSelector({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

function Profile() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.email;

  const [user, setUser] = useState(null);
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [location, setLocation] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapOpen, setMapOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      window.location.href = "/login";
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await API.get(`/api/auth/profile/${email}`);
        setUser(res.data);
        setPhone(res.data.phone || "");
        setAddress(res.data.address || "");
        setCity(res.data.city || "");
        setState(res.data.state || "");
        setProfilePictureUrl(res.data.profilePictureUrl || "");
        if (res.data.latitude && res.data.longitude) {
          setLocation({ lat: res.data.latitude, lng: res.data.longitude });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [email]);

  const saveProfile = async () => {
    const data = {
      phone, address, city, state,
      profilePictureUrl,
      latitude: location.lat,
      longitude: location.lng
    };

    try {
      await API.put(`/api/auth/profile/${email}`, data);
      alert("✨ Profile updated successfully!");
    } catch (err) {
      alert("❌ Profile update failed");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfilePictureUrl(res.data);
    } catch (err) {
      alert("Image upload failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Banner Accent */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

      <div className="max-w-5xl mx-auto -mt-24 px-4">
        <div className="flex items-center mb-6">

<button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-blue-50 hover:shadow-md transition-all"
>

<ArrowLeft size={18} />



</button>

</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center sticky top-8">
              <div className="relative inline-block mb-6">
                <img
                  src={previewImage || profilePictureUrl || "https://ui-avatars.com/api/?name=" + user.name}
                  alt="Avatar"
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg"
                />
                <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-transform hover:scale-110">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 flex items-center justify-center gap-1 mt-1">
                <Mail size={14} /> {user.email}
              </p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <button 
                  onClick={saveProfile}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User className="text-blue-600" size={20} /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input value={user.name} readOnly className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent text-slate-500 cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input value={user.email} readOnly className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent text-slate-500 cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      placeholder="e.g. +1 234 567 890" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} /> Address & Location
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">State</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <select 
                      value={state} 
                      onChange={(e) => setState(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 appearance-none bg-white focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Select State</option>
                      {Object.keys(states).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">City</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <select 
                      value={city} 
                      disabled={!state}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 appearance-none bg-white focus:border-blue-500 outline-none transition-all disabled:bg-slate-50"
                    >
                      <option value="">Select City</option>
                      {state && states[state].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-medium text-slate-600 ml-1">Full Address</label>
                <textarea 
                  rows="3" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                  placeholder="Enter house no, street name, etc."
                />
              </div>

              {/* Precise Location Visualization */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <MapIcon className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">Precise Location</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setMapOpen(true)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all"
                >
                  Adjust on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {mapOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Select Location</h2>
                <p className="text-sm text-slate-500">Click on the map to mark your position</p>
              </div>
              <button 
                onClick={() => setMapOpen(false)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            
            <div className="h-[450px] relative">
              <MapContainer center={[location.lat, location.lng]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[location.lat, location.lng]} />
                <LocationSelector setLocation={setLocation} />
              </MapContainer>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setMapOpen(false)}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;