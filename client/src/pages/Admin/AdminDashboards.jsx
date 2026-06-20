import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../api/axios.js";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const statusColors = {
  Pending: "bg-gray-700 text-gray-300",
  Processing: "bg-yellow-900/40 text-yellow-400",
  Shipped: "bg-blue-900/40 text-blue-400",
  Delivered: "bg-green-900/40 text-green-400",
  Cancelled: "bg-red-900/40 text-red-400",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axiosInstance.get("/admin/stats"),
          axiosInstance.get("/admin/orders"),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = stats?.monthlyRevenue?.map((item) => ({
    month: monthNames[item._id.month - 1],
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  const maxSold = stats?.topProducts?.[0]?.totalSold || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: "💰", label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: "bg-orange-500/10" },
          { icon: "🧾", label: "Total Orders", value: stats?.totalOrders || 0, color: "bg-blue-500/10" },
          { icon: "👥", label: "Total Users", value: stats?.totalUsers || 0, color: "bg-green-500/10" },
          { icon: "📦", label: "Total Products", value: stats?.totalProducts || 0, color: "bg-yellow-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`w-9 h-9 ${stat.color} rounded-lg flex items-center justify-center text-lg mb-3`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-gray-100">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-300 mb-4">Monthly Revenue</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "0.5px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#EA580C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-600 text-sm">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-300 mb-4">Top Selling Products</h2>
          {stats?.topProducts?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {stats.topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${index === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-800 text-gray-400"}`}>
                    {index + 1}
                  </div>
                  <p className="text-xs text-gray-300 flex-1 truncate">{product._id}</p>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${(product.totalSold / maxSold) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 w-6 text-right">{product.totalSold}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-600 text-sm">
              No sales data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-300">Recent Orders</h2>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-xs text-orange-500 hover:text-orange-400"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-[1fr_120px_100px_90px] gap-4 text-xs text-gray-600 font-medium uppercase tracking-wide mb-3">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="flex flex-col">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-[1fr_120px_100px_90px] gap-4 items-center py-2.5 border-t border-gray-800 text-sm"
            >
              <span className="font-mono text-xs text-gray-500">#{order._id.slice(-8)}</span>
              <span className="text-xs text-gray-300">{order.user?.name || "Unknown"}</span>
              <span className="text-xs font-medium text-gray-200">₹{order.totalAmount.toLocaleString()}</span>
              <span className={`text-xs px-2 py-1 rounded-full text-center ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-600 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;