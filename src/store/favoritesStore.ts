import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Favorite {
  id: number;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  createdAt: string;
}

interface FavoritesStore {
  favorites: Favorite[];
  setFavorites: (favorites: Favorite[]) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      setFavorites: (favorites) => set({ favorites }),
      
      addFavorite: (favorite) => set((state) => ({
        favorites: [favorite, ...state.favorites]
      })),
      
      removeFavorite: (movieId) => set((state) => ({
        favorites: state.favorites.filter(fav => fav.movieId !== movieId)
      })),
      
      isFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.movieId === movieId);
      },
      
      clearFavorites: () => set({ favorites: [] })
    }),
    {
      name: 'favorites-storage'
    }
  )
);
