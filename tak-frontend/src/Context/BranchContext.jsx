// context/BranchIdContext.js
import { createContext, useContext, useState, useEffect } from "react";

const BranchIdContext = createContext(null);

export const BranchIdProvider = ({ children }) => {
  const [BranchId, setBranchId] = useState(() => {
    const stored = localStorage.getItem("BranchId");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (BranchId) {
      localStorage.setItem("BranchId", JSON.stringify(BranchId));
    } else {
      localStorage.removeItem("BranchId");
    }
  }, [BranchId]);

  return (
    <BranchIdContext.Provider value={{ BranchId, setBranchId }}>
      {children}
    </BranchIdContext.Provider>
  );
};

export const useBranchId = () => useContext(BranchIdContext);
