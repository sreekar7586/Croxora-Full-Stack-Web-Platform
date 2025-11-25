import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          const { data } = await api.post('/auth/login', credentials);
          set({
            user: data.data,
            token: data.data.token,
            isAuthenticated: true,
          });
          localStorage.setItem('token', data.data.token);
          toast.success('Logged in successfully');
          return data.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      register: async (userData) => {
        try {
          const { data } = await api.post('/auth/register', userData);
          set({
            user: data.data,
            token: data.data.token,
            isAuthenticated: true,
          });
          localStorage.setItem('token', data.data.token);
          toast.success('Registered successfully');
          return data.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem('token');
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      updateProfile: async (userData) => {
        try {
          const { data } = await api.put('/auth/profile', userData);
          set({ user: data.data });
          toast.success('Profile updated successfully');
          return data.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Update failed';
          toast.error(message);
          throw error;
        }
      },
    }));
