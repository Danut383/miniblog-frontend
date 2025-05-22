import { create } from 'zustand';
import { login as backendLogin, register as backendRegister } from '../services/api';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

// Helper functions para localStorage
const saveToStorage = (token: string, user: any) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

const clearStorage = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// Recuperar datos persistidos al iniciar la aplicación
const storedToken = localStorage.getItem('auth_token');
const storedUser = localStorage.getItem('auth_user');
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create<AuthState>((set) => ({
  // Inicializamos con valores de localStorage si existen
  token: storedToken || null,
  user: parsedUser || null,
  isAuthenticated: !!storedToken,
  loading: false,

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { token, user } = await backendLogin(email, password);
      set({ user, token, loading: false, isAuthenticated: true });
      saveToStorage(token, user);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true });
    try {
      await backendRegister(email, password, name);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: () => {
    set({ user: null, token: null, isAuthenticated: false });
    clearStorage();
  },
}));