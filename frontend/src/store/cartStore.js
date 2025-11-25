import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Fetch cart error:', error);
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      set({ cart: data.data });
      toast.success('Added to cart');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      set({ cart: data.data });
      toast.success('Cart updated');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      set({ cart: data.data });
      toast.success('Item removed');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const { data } = await api.delete('/cart');
      set({ cart: data.data });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  },

  getCartCount: () => {
    const { cart } = get();
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  },
}));
