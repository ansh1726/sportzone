import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../store/productStore.js";
import useAuthStore from "../store/authStore.js";
import useCartStore from "../store/cartStore.js";
import axiosInstance from "../api/axios.js";
import toast from "react-hot-toast";

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, fetchProductById } = useProductStore();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductById(id);
    setQuantity(1);
    setSelectedImage(0);
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "inc" && quantity < product.stock) setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axiosInstance.post(`/products/${id}/review`, { rating, comment });
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      fetchProductById(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categories.find((c) => c.name === categoryName)?.icon || "🏅";
  };

  const getRatingBars = () => {
    if (!product?.reviews?.length) return [];
    return [5, 4, 3, 2, 1].map((star) => {
      const count = product.reviews.filter((r) => Math.round(r.rating) === star).length;
      const percentage = (count / product.reviews.length) * 100;
      return { star, count, percentage };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium text-gray-600">Product not found</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-orange-500 text-white text-sm px-5 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-4 flex items-center gap-1 flex-wrap">
        <span className="cursor-pointer hover:text-orange-500" onClick={() => navigate("/")}>Home</span>
        <span>/</span>
        <span className="cursor-pointer hover:text-orange-500" onClick={() => navigate("/products")}>Products</span>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[150px]">{product.name}</span>
      </div>

      {/* Product Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-10">
        {/* Images */}
        <div>
          <div className="h-56 sm:h-64 md:h-72 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-3 border border-gray-200 overflow-hidden">
            {product.images?.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-7xl md:text-8xl">{getCategoryIcon(product.category)}</span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                    selectedImage === i ? "border-orange-500" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-orange-500 uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm">{"⭐".repeat(Math.round(product.ratings))}</span>
            <span className="text-sm font-medium text-gray-700">{product.ratings.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.numReviews} reviews)</span>
          </div>

          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            ₹{product.price.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mb-4">Inclusive of all taxes</p>

          {product.stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              In Stock ({product.stock} left)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Out of Stock
            </span>
          )}

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-600">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg flex items-center justify-center transition"
                >
                  −
                </button>
                <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-gray-800 border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-5">
            {product.stock > 0 ? (
              <button
                onClick={() => addToCart(product._id, quantity)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition text-sm"
              >
                🛒 Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-400 font-medium py-2.5 rounded-lg text-sm cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg flex items-center justify-center text-lg transition">
              ♡
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-6 md:pt-8">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-5">Customer Reviews</h2>

        {product.reviews?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white border border-gray-200 rounded-xl p-4 md:p-5 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">{product.ratings.toFixed(1)}</div>
              <div className="text-yellow-400 text-lg mt-1">{"⭐".repeat(Math.round(product.ratings))}</div>
              <div className="text-xs text-gray-400 mt-1">{product.numReviews} reviews</div>
            </div>
            <div className="flex-1 w-full">
              {getRatingBars().map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-gray-500 w-8">{star} ⭐</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.reviews?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`}
                    alt={review.name}
                    className="w-7 h-7 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-yellow-400 text-xs mb-2">{"⭐".repeat(review.rating)}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 mb-6">
            <div className="text-4xl mb-2">💬</div>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}

        {/* Add Review Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="text-2xl cursor-pointer transition"
                  style={{ color: star <= (hoveredStar || rating) ? "#f59e0b" : "#d1d5db" }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              required
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400 resize-none mb-3"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;