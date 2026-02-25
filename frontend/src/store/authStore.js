// frontend/src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  admin: null,
  token: localStorage.getItem('adminToken') || null,
  loading: false,

  // Action to log in and save the token
  login: (adminData, token) => {
    localStorage.setItem('adminToken', token);
    set({ admin: adminData, token, loading: false });
  },

  // Action to log out
  logout: () => {
    localStorage.removeItem('adminToken');
    set({ admin: null, token: null });
  },
}));