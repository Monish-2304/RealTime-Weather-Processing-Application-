import { create } from "zustand";
import { AuthState } from "@/types/auth.types";
import axios from "axios";

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || null,
  user: null,
  loading: true,

  initialize: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(
          "http://localhost:5000/api/auth/user",
          { withCredentials: true }
        );
        set({ token, user: response.data, loading: false });
      } catch (error) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        set({ token: null, user: null, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { withCredentials: true }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ token, user });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  signup: async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, password },
        { withCredentials: true }
      );
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({ token, user });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    set({ token: null, user: null });
  },
}));

useAuthStore.getState().initialize();
