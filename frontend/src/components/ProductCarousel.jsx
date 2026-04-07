import Slider from "react-slick";
import ProductCard from "./ProductCard";

function ProductCarousel({title,products}){

const settings={
dots:false,
infinite:false,
slidesToShow:5,
slidesToScroll:1,
responsive:[
{breakpoint:1024,settings:{slidesToShow:3}},
{breakpoint:640,settings:{slidesToShow:2}}
]
};

return(

<div className="mb-12">

<h2 className="text-2xl font-bold mb-4">
{title}
</h2>

<Slider {...settings}>

{products.map((p,i)=>(
<ProductCard key={i} product={p}/>
))}

</Slider>

</div>

);

}

export default ProductCarousel;