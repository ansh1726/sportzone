import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import useProductStore from "../store/productStore.js";
import useCartStore from "../store/cartStore.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { setFilters } = useProductStore();
  const [dropdown, setDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { itemCount } = useCartStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ keyword: search });
    navigate("/products");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">🏆</span>
        </div>
        <div>
          <p className="text-white font-semibold text-base leading-tight">SportZone</p>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Your game, our gear</p>
        </div>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for cricket bats, footballs..."
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:border-orange-500"
          />
        </div>
      </form>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1">
        <Link
          to="/"
          className="text-gray-300 hover:text-white hover:bg-gray-800 text-sm px-3 py-2 rounded-lg transition"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="text-gray-300 hover:text-white hover:bg-gray-800 text-sm px-3 py-2 rounded-lg transition"
        >
          Products
        </Link>
      </div>

      {/* Cart */}
      <Link to="/cart" className="relative flex-shrink-0">
        <div className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-gray-300 text-lg">🛒</span>
        </div>
        {itemCount > 0 && (
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                 {itemCount}
            </div>
        )}
      </Link>

      {/* Avatar + Dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setDropdown(!dropdown)}
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full border-2 border-orange-500"
          />
          <span className="text-gray-300 text-sm hidden md:block">
            {user?.name?.split(" ")[0]}
          </span>
        </div>

        {dropdown && (
          <div className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-xl shadow-xl w-48 py-2 z-50">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setDropdown(false)}
            >
              👤 Profile
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setDropdown(false)}
            >
              📦 My Orders
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setDropdown(false)}
              >
                ⚙️ Admin Panel
              </Link>
            )}
            <div className="border-t border-gray-700 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;