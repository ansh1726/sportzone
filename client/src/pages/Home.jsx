import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../store/productStore.js";

const categories = [
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Badminton", icon: "🏸" },
  { name: "Tennis", icon: "🎾" },
  { name: "Basketball", icon: "🏀" },
  { name: "Swimming", icon: "🏊" },
  { name: "Running", icon: "👟" },
  { name: "Fitness", icon: "🏋️" },
];

const Home = () => {
  const { products, isLoading, fetchProducts, setFilters } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setFilters({ category });
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="px-8 py-16 flex items-center justify-between gap-8"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d1a0a 50%, #1a1a1a 100%)",
        }}
      >
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs px-3 py-1.5 rounded-full mb-4">
            🔥 New arrivals this week
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-3">
            Gear Up For <br />
            <span className="text-orange-500">Your Game</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Premium sports equipment for every athlete. <br />
            From cricket to football, we've got you covered.
          </p>
          <div className="flex gap-3">
          <button
      onClick={() => navigate("/products")}
      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
       >
       Shop Now
          </button>
            <button
                onClick={() => {
                 document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
                    }}
                className="bg-transparent border border-gray-500 text-white hover:border-gray-300 text-sm px-6 py-2.5 rounded-lg transition"
                    >
                         View Categories
                        </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 flex-shrink-0">
          {[
            { num: "500+", label: "Products" },
            { num: "50+", label: "Brands" },
            { num: "10k+", label: "Customers" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[80px]"
            >
              <div className="text-2xl font-bold text-orange-500">{stat.num}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div id="categories" className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Shop by Category</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-orange-500 hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-orange-400 hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium text-gray-800">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-8 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Featured Products</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-orange-500 hover:underline"
          >
            View all →
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🏪</div>
            <p>No featured products yet. Add some from the admin panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-orange-300 transition"
              >
                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl">
                  {categories.find((c) => c.name === product.category)?.icon || "🏅"}
                </div>
                <div className="p-4">
                  <p className="text-xs text-orange-500 uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mb-1">{product.name}</p>
                  <p className="text-xs text-yellow-500 mb-3">
                    {"⭐".repeat(Math.round(product.ratings))} ({product.numReviews})
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;