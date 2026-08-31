import { createContext, useContext, useState, useCallback } from "react";

const CompareContext = createContext(null);
const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState([]);

  const toggleCompare = useCallback((id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  return (
    <CompareContext.Provider value={{ compareIds, toggleCompare, clearCompare, maxCompare: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
