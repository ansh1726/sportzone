import { create } from "zustand";
import axiosInstance from "../api/axios.js";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,

  register: async (name, email, password) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("jwt", res.data.token);
      set({ user: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  },

  login: async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("jwt", res.data.token);
      set({ user: res.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("jwt");
      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      localStorage.removeItem("jwt");
      set({ user: null });
      toast.success("Logged out successfully!");
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      set({ isCheckingAuth: false });
      return;
    }
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data });
    } catch {
      localStorage.removeItem("jwt");
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;