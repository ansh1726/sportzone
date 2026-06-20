import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.js";

const statusColors = {
  Pending: "bg-gray-100 text-gray-600",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/my");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-semibold text-gray-800 mb-2">No orders yet</p>
          <p className="text-sm text-gray-400 mb-6">
            When you place an order, it'll show up here
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="flex flex-col gap-4 max-w-3xl">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate("/order-success", { state: { order } })}
            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-orange-300 transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8)}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            {/* Items Preview */}
            <div className="flex items-center gap-2 mb-3">
              {order.items.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl overflow-hidden flex-shrink-0"
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    "🏅"
                  )}
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
              <p className="text-base font-semibold text-gray-800">
                ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;