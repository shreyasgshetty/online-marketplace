import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Electronics", image: "/categories/electronics.jpg", color: "from-blue-600/20" },
  { name: "Fashion", image: "/categories/fashion.jpg", color: "from-pink-600/20" },
  { name: "Automobile", image: "/categories/automobile.jpg", color: "from-slate-600/20" },
  { name: "Books", image: "/categories/books.jpg", color: "from-orange-600/20" },
  { name: "Home", image: "/categories/home.jpg", color: "from-green-600/20" },
  { name: "Sports", image: "/categories/sports.jpg", color: "from-red-600/20" }
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function CategoryBanners() {
    const navigate = useNavigate();
    
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 font-sans">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900 md:text-4xl">
            Browse by <span className="text-blue-600">Category</span>
          </h2>
          <p className="mt-2 text-neutral-500">Explore our curated selection across all industries</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group relative cursor-pointer"
          >
            {/* Main Card Container */}
            <div 
            onClick={() => navigate(`/${cat.name.toLowerCase()}`)}
            className="relative h-48 w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-blue-500/10 sm:h-64 lg:h-72">
              
              {/* Image with Parallax Zoom */}
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dynamic Gradient Overlay - Reactive to individual category colors */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              {/* Standard Dark Overlay */}
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40" />

              {/* Bottom Label Container */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full translate-y-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-center backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:bg-white group-hover:shadow-lg">
                    <span 
                    onClick={() => navigate(`/${cat.name.toLowerCase()}`)}
                    className="text-sm font-bold tracking-wide text-white transition-colors duration-500 group-hover:text-black sm:text-base">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative "Explore" indicator that appears on hover */}
              <div className="absolute right-4 top-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <ArrowRightIcon />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// Simple internal icon component
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

export default CategoryBanners;