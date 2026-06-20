import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios.js";
import toast from "react-hot-toast";

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/admin/orders");
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success("Order status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusCount = (status) => {
    if (status === "All") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const filteredOrders =
    activeFilter === "All" ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-100">Manage Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", ...statusOptions].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              activeFilter === status
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600"
            }`}
          >
            {status} ({getStatusCount(status)})
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[100px_1fr_110px_90px_80px_140px] gap-3 px-4 py-3 bg-gray-950 text-xs text-gray-600 font-medium uppercase tracking-wide">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Payment</span>
            <span>Status</span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="border-t border-gray-800">
                <div
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order._id ? null : order._id)
                  }
                  className="grid grid-cols-[100px_1fr_110px_90px_80px_140px] gap-3 px-4 py-3 items-center cursor-pointer hover:bg-gray-800/50 transition"
                >
                  <span className="font-mono text-xs text-gray-500">#{order._id.slice(-8)}</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={order.user?.avatar}
                      alt={order.user?.name}
                      className="w-7 h-7 rounded-full bg-gray-800"
                    />
                    <div>
                      <p className="text-xs text-gray-200">{order.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-600">{order.user?.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-medium text-gray-200">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full text-center w-fit ${
                    order.isPaid ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"
                  }`}>
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="bg-gray-950 border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Expanded View */}
                {expandedOrder === order._id && (
                  <div className="bg-gray-950 mx-4 mb-3 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">Items Ordered</p>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-none"
                      >
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            "🏅"
                          )}
                        </div>
                        <p className="text-xs text-gray-300 flex-1">{item.name}</p>
                        <p className="text-xs text-gray-500">× {item.quantity}</p>
                        <p className="text-xs text-gray-300">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-xs font-medium text-gray-400 mb-1">Shipping Address</p>
                      <p className="text-xs text-gray-500">
                        {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.pincode}, {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;