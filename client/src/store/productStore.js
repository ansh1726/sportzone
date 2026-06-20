import { create } from "zustand";
import axiosInstance from "../api/axios.js";
import toast from "react-hot-toast";

const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  totalPages: 1,
  total: 0,
  isLoading: false,
  filters: {
    keyword: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    }));
    get().fetchProducts();
  },

  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    get().fetchProducts();
  },

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const { keyword, category, minPrice, maxPrice, page } = get().filters;

      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("page", page);

      const res = await axiosInstance.get(`/products?${params.toString()}`);
      set({
        products: res.data.products,
        totalPages: res.data.totalPages,
        total: res.data.total,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, product: null });
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      set({ product: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch product");
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useProductStore;