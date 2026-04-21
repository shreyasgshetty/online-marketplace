import { useEffect, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-4 md:right-8 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/20 p-2 md:p-3 text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black md:flex"
    onClick={onClick}
  >
    <ChevronRight size={20} className="md:w-6 md:h-6" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-4 md:left-8 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/20 p-2 md:p-3 text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black md:flex"
    onClick={onClick}
  >
    <ChevronLeft size={20} className="md:w-6 md:h-6" />
  </button>
);

function HeroCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await API.get("/api/banners");
        setBanners(res.data);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 1000,
    slidesToShow: 1,
    swipeToSlide: true, // Better for mobile touch
    beforeChange: (current, next) => setActiveIndex(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div className="absolute bottom-4 md:bottom-8">
        <ul className="flex justify-center gap-2 md:gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${i === activeIndex ? "w-6 md:w-10 bg-blue-500" : "w-2 md:w-3 bg-white/40"}`} />
    ),
  };

  if (loading) {
    return (
      <div className="h-[400px] md:h-[550px] w-full animate-pulse rounded-2xl md:rounded-[2.5rem] bg-neutral-900 mx-auto max-w-[1400px] mt-6" />
    );
  }

  return (
    <div className="relative mx-auto max-w-[1500px] overflow-hidden px-2 md:px-4 py-4 md:py-8 font-sans">
      <Slider {...settings} className="group">
        {banners.map((b, i) => (
          <div key={i} className="relative outline-none px-1 md:px-2">
            <div className="relative h-[400px] md:h-[550px] w-full overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-2xl">
              
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: activeIndex === i ? 1 : 1.1 }}
                transition={{ duration: 6 }}
                src={b.imageUrl}
                alt={b.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex items-center px-6 md:px-16">
                <div className="max-w-2xl">
                  <AnimatePresence mode="wait">
                    {activeIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mb-2 md:mb-4 flex items-center gap-2 w-fit rounded-full bg-blue-500/20 border border-blue-500/50 px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md"
                        >
                          <Sparkles size={12} className="md:w-3.5 md:h-3.5" /> {b.tag || "Premium Selection"}
                        </motion.div>

                        <motion.h2 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mb-2 md:mb-4 text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
                        >
                          {b.title}
                        </motion.h2>

                        <motion.p 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="mb-6 md:mb-8 max-w-sm md:max-w-lg text-sm md:text-lg leading-relaxed text-gray-300 line-clamp-2 md:line-clamp-none"
                        >
                          {b.description || "Elevate your lifestyle with our exclusive curated items."}
                        </motion.p>

                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/category/${b.redirectCategory}`)}
                          className="group/btn relative flex items-center gap-2 md:gap-3 overflow-hidden rounded-xl md:rounded-2xl bg-white px-6 py-3 md:px-10 md:py-4 text-sm md:text-base font-bold text-black transition-all"
                        >
                          <span className="relative z-10">Explore Now</span>
                          <ArrowRight className="relative z-10 transition-transform group-hover/btn:translate-x-1" size={18} />
                          <div className="absolute inset-0 z-0 translate-y-full bg-blue-500 transition-transform md:group-hover/btn:translate-y-0" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress Line */}
              <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
                <motion.div 
                  key={activeIndex}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroCarousel;