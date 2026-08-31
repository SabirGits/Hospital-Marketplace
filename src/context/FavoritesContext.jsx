import { createContext, useContext, useState, useCallback, useMemo } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]); // [{ id, type, name }]

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id && f.type === item.type);
      if (exists) return prev.filter((f) => !(f.id === item.id && f.type === item.type));
      return [...prev, item];
    });
  }, []);

  const isFavorite = useCallback(
    (id, type) => favorites.some((f) => f.id === id && f.type === type),
    [favorites]
  );

  const value = useMemo(() => ({ favorites, toggleFavorite, isFavorite }), [favorites, toggleFavorite, isFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
