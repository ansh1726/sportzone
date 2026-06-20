import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useCartStore from "../store/cartStore.js";
import useAuthStore from "../store/authStore.js";
import axiosInstance from "../api/axios.js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    pincode: user?.address?.pincode || "",
    country: user?.address?.country || "India",
  });

  const subtotal = cart?.totalPrice || 0;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.country) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    setIsProcessing(true);

    try {
      const { data } = await axiosInstance.post("/payment/create-intent", {
        shippingAddress,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.name,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setIsProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        const orderRes = await axiosInstance.post("/payment/create-order", {
          paymentIntentId: result.paymentIntent.id,
          shippingAddress,
        });

        await fetchCart();
        navigate("/order-success", { state: { order: orderRes.data } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-[1fr_300px] gap-6">
      {/* Left */}
      <div>
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-medium">✓</div>
            <span className="text-sm text-gray-400">Cart</span>
          </div>
          <div className="flex-1 h-px bg-orange-500 max-w-[60px]"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-medium">2</div>
            <span className="text-sm font-medium text-gray-800">Checkout</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 max-w-[60px]"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-xs flex items-center justify-center font-medium border border-gray-200">3</div>
            <span className="text-sm text-gray-400">Confirmation</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">📦 Shipping Address</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                placeholder="123, MG Road, Satellite"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                placeholder="Ahmedabad"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleAddressChange}
                placeholder="380015"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                placeholder="India"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">💳 Payment Details</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#374151",
                    "::placeholder": { color: "#9ca3af" },
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
            🧪 Test card: <span className="font-mono">4242 4242 4242 4242</span> — any future date, any CVC
          </p>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString()} →`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            🔒 Powered by Stripe — your card is never stored
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3 mb-4">
            {cart?.items?.map((item) => (
              <div key={item.product} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    "🏅"
                  )}
                </div>
                <p className="text-xs text-gray-700 flex-1">{item.name} × {item.quantity}</p>
                <p className="text-xs font-medium text-gray-800">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Shipping</span><span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>GST (18%)</span><span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-800 border-t border-gray-100 pt-2 mt-1">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const Checkout = () => {
  const { cart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cart?.items?.length) {
      navigate("/cart");
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;