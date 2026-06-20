import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

import useAuthStore from "./store/authStore.js";
import useCartStore from "./store/cartStore.js";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboards.jsx";
import ManageProducts from "./pages/Admin/ManageProducts.jsx";
import ManageOrders from "./pages/Admin/ManageOrders.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import Orders from "./pages/Orders.jsx";

const App = () => {

  const { checkAuth } = useAuthStore();
  const { fetchCart } = useCartStore();

useEffect(() => {
  checkAuth();
  fetchCart();
}, [checkAuth, fetchCart]);

const location = useLocation();
const hideNavbarRoutes = ["/login", "/register"];
const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
        <Toaster position="top-right" />
    {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
             <Home/>
            </ProtectedRoute>
          }
        />
        <Route
           path="/products"
          element={
          <ProtectedRoute>
             <Products />
          </ProtectedRoute>
           }
         />
         <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
                <ProductDetail />
            </ProtectedRoute>
          }
          />
          <Route
           path="/cart"
          element={
          <ProtectedRoute>
                <Cart />
          </ProtectedRoute>
          }
          />
          <Route
            path="/checkout"
             element={
              <ProtectedRoute>
                  <Checkout />
              </ProtectedRoute>
          }
          />
          <Route
             path="/order-success"
              element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } 
          />
          <Route
            path="/orders"
            element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
          }
          />
          <Route
          path="/admin"
          element={
          <AdminRoute>
          <AdminLayout />
          </AdminRoute>
          }
          >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="users" element={<ManageUsers />} />
          </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
