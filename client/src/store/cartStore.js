import { create } from "zustand";
import axiosInstance from "../api/axios.js";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: { items: [], totalPrice: 0 },
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/cart");
      set({
        cart: res.data,
        itemCount: res.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      await axiosInstance.post("/cart/add", { productId, quantity });
      await get().fetchCart();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  },

  updateItem: async (productId, quantity) => {
    try {
      await axiosInstance.patch("/cart/update", { productId, quantity });
      await get().fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  },

  removeItem: async (productId) => {
    try {
      await axiosInstance.delete(`/cart/remove/${productId}`);
      await get().fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  },

  clearCart: async () => {
    try {
      await axiosInstance.delete("/cart/clear");
      set({ cart: { items: [], totalPrice: 0 }, itemCount: 0 });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  },
}));

export default useCartStore;