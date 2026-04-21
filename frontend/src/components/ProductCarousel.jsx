import Slider from "react-slick";
import ProductCard from "./ProductCard";

function ProductCarousel({ title, products }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    className: "slider-padding-fix", // Useful if you want to target with CSS
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, arrows: false, centerMode: true, centerPadding: '20px' } }
    ]
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mb-14 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          {title}
          <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
        </h2>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {/* CAROUSEL */}
      <div className="-mx-3"> {/* Negative margin offsets the card padding */}
        <Slider {...settings}>
          {products.map((p, i) => (
            <div key={p.id || i} className="px-3 py-4 h-full">
              <ProductCard product={p} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ProductCarousel;