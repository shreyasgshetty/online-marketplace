import { useEffect,useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import ProductCarousel from "../components/ProductCarousel";
import CategoryBanners from "../components/CategoryBanners";

function Home(){

const [trending,setTrending]=useState([]);
const [recommended,setRecommended]=useState([]);

useEffect(()=>{
loadHome();
},[]);

const loadHome=async()=>{

const trendingRes=await API.get("/api/products/trending");
const recommendedRes=await API.get("/api/products/recommended");

setTrending(trendingRes.data);
setRecommended(recommendedRes.data);

};

// ✅ FILTER LOGIC
const filterProducts = (products) => {
  return products.filter(p =>
    p.sellingType === "fixed" &&
    p.status === "AVAILABLE"
  );
};

return(

<div>

<Navbar/>

<div className="max-w-7xl mx-auto p-6">

<HeroCarousel/>

<ProductCarousel
title="Trending Products"
products={filterProducts(trending)}
/>

<CategoryBanners/>

<ProductCarousel
title="Recommended For You"
products={filterProducts(recommended)}
/>

</div>

</div>

);

}

export default Home;