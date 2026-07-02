import { useEffect, useState } from "react";
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
  { name: "Other", icon: "🏅" },
];

const Products = () => {
  const { products, isLoading, totalPages, total, filters, setFilters, setPage, fetchProducts } =
    useProductStore();
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setFilters({ category: filters.category === category ? "" : category });
  };

  const handleApplyPrice = () => {
    setFilters({ minPrice, maxPrice });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setFilters({ category: "", minPrice: "", maxPrice: "", keyword: "" });
    setShowFilters(false);
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortBy === "priceLow") return sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") return sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "topRated") return sorted.sort((a, b) => b.ratings - a.ratings);
    return sorted;
  };

  const sortedProducts = getSortedProducts();

  const FilterContent = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
        <button onClick={handleClearFilters} className="text-xs text-orange-500 hover:underline">
          Clear all
        </button>
      </div>

      {/* Category */}
      <div className="mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Category</p>
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm mb-0.5 transition ${
              filters.category === cat.name
                ? "bg-orange-50 text-orange-500 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Price Range (₹)</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-orange-400"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-orange-400"
          />
        </div>
        <button
          onClick={handleApplyPrice}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-1.5 rounded-lg transition"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Button */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="text-gray-800 font-medium">{sortedProducts.length}</span> of{" "}
          <span className="text-gray-800 font-medium">{total}</span> products
          {filters.category && (
            <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
              {filters.category}
            </span>
          )}
        </p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-orange-500 text-white text-xs font-medium px-3 py-2 rounded-lg"
        >
          🔧 Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <FilterContent />
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-gray-800 text-white text-sm font-medium py-2.5 rounded-lg mt-2"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0 bg-white border-r border-gray-200 p-5 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <FilterContent />
        </div>

        {/* Main */}
        <div className="flex-1 p-4 md:p-6">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing <span className="text-gray-800 font-medium">{sortedProducts.length}</span> of{" "}
              <span className="text-gray-800 font-medium">{total}</span> products
              {filters.category && (
                <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                  {filters.category}
                </span>
              )}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
            >
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="topRated">Top Rated</option>
            </select>
          </div>

          {/* Mobile Sort */}
          <div className="md:hidden mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="topRated">Top Rated</option>
            </select>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium text-gray-600">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 bg-orange-500 text-white text-sm px-5 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {sortedProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-orange-300 transition"
                >
                  <div className="h-36 md:h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">
                        {categories.find((c) => c.name === product.category)?.icon || "🏅"}
                      </span>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
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
                      {product.stock === 0 ? (
                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-lg">
                          Out of Stock
                        </span>
                      ) : (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(filters.page - 1)}
                disabled={filters.page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                    filters.page === p
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border border-gray-200 text-gray-600 hover:border-orange-400"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;