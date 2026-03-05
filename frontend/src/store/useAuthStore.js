import { create } from "zustand";
import toast from "react-hot-toast";
// import axios from "../lib/axios.js";
import {axiosInstance} from "../lib/axiosInstance.js";

export const useAuthStore = create((set) => ({
  // ================= STATE =================
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile:false,
  isCheckingAuth: true, // 👈 comma important

  // ================= CHECK AUTH =================
checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/auth/check");

    set({ authUser: res.data.user });

  } catch (error) {
    set({ authUser: null });
    console.log(error);
  } finally {
    set({ isCheckingAuth: false });
  }
},

  // ================= SIGNUP =================
   signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      // get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      // get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
    updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));