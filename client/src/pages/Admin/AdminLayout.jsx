import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: "📊", end: true },
  { path: "/admin/products", label: "Products", icon: "📦" },
  { path: "/admin/orders", label: "Orders", icon: "🧾" },
  { path: "/admin/users", label: "Users", icon: "👥" },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🏆</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">SportZone</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition ${
                  isActive
                    ? "bg-orange-500 text-white font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-7 h-7 rounded-full border border-gray-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition mb-1"
          >
            🏪 Back to Store
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;