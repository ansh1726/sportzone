import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

const stepIcons = {
  Pending: "📋",
  Processing: "⚙️",
  Shipped: "🚚",
  Delivered: "📦",
};

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    if (!order) navigate("/");
  }, [order]);

  if (!order) return null;

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* Success Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Thank you for shopping with SportZone.<br />
            Your order is confirmed and being processed.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 inline-block font-mono text-xs text-gray-500 mb-6">
            Order ID: #{order._id}
          </div>

          {/* Delivery Steps */}
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-2 z-10 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 bg-white ${
                    index < currentStepIndex
                      ? "border-green-500 bg-green-50"
                      : index === currentStepIndex
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  {index < currentStepIndex ? "✓" : stepIcons[step]}
                </div>
                <span
                  className={`text-xs ${
                    index === currentStepIndex
                      ? "text-orange-500 font-medium"
                      : index < currentStepIndex
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Order Details</h2>
          <div className="flex flex-col gap-0">
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
              <span className="text-gray-500">Status</span>
              <span className="text-orange-500 font-medium">{order.status}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="text-green-600 font-medium">Paid ✓</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-800 font-medium">
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">Shipping To</span>
              <span className="text-gray-800 text-right max-w-[200px]">
                {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.pincode}, {order.shippingAddress.country}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Items Ordered</h2>
          <div className="flex flex-col">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-none"
              >
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    "🏅"
                  )}
                </div>
                <p className="text-sm text-gray-700 flex-1">{item.name}</p>
                <p className="text-xs text-gray-400">× {item.quantity}</p>
                <p className="text-sm font-medium text-gray-800">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition text-sm"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/products")}
            className="bg-white border border-gray-200 text-gray-600 hover:text-gray-800 font-medium py-2.5 rounded-lg transition text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;