import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore.js";

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

const Cart = () => {
  const { cart, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const getCategoryIcon = (categoryName) => {
    return categories.find((c) => c.name === categoryName)?.icon || "🏅";
  };

  const subtotal = cart?.totalPrice || 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-400 mb-6">
            Looks like you haven't added anything yet
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        My Cart{" "}
        <span className="text-sm font-normal text-gray-400">
          ({cart.items.length} items)
        </span>
      </h1>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Cart Items */}
        <div className="flex flex-col gap-3">
          {cart.items.map((item) => (
            <div
              key={item.product}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center"
            >
              {/* Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">
                    {getCategoryIcon(item.product?.category)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-xs text-orange-500 uppercase tracking-wide mb-1">
                  {item.product?.category}
                </p>
                <p className="text-sm font-medium text-gray-800 mb-1">{item.name}</p>
                <p className="text-xs text-gray-400">₹{item.price.toLocaleString()} per item</p>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-2">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateItem(item.product._id || item.product, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-9 h-8 flex items-center justify-center text-sm font-medium text-gray-800 border-x border-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItem(item.product._id || item.product, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <p className="text-sm font-semibold text-gray-800">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product._id || item.product)}
                  className="text-xs text-red-400 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Subtotal ({cart.items.length} items)</span>
              <span className="text-gray-800">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Tax (18% GST)</span>
              <span className="text-gray-800">₹{gst.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-base font-semibold text-gray-800 border-t border-gray-100 pt-3 mt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition text-sm mt-4"
            >
              Proceed to Checkout →
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-transparent border border-gray-200 text-gray-500 hover:text-gray-700 font-medium py-2 rounded-lg transition text-sm mt-2"
            >
              Continue Shopping
            </button>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              🔒 Secure checkout with Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;