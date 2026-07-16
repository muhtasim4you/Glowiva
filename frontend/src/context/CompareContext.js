import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const isInitialMount = useRef(true);
  const MAX_COMPARE_ITEMS = 4;

  // Load compare list from localStorage on mount
  useEffect(() => {
    try {
      const savedCompare = localStorage.getItem('compare');
      if (savedCompare) {
        const parsedCompare = JSON.parse(savedCompare);
        if (Array.isArray(parsedCompare)) {
          setCompareItems(parsedCompare);
        }
      }
    } catch (error) {
      console.error('Error loading compare list from localStorage:', error);
      localStorage.removeItem('compare');
    }
  }, []);

  // Save compare list to localStorage whenever it changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    if (compareItems.find(item => item._id === product._id)) {
      toast.info('Product already in compare list');
      return;
    }

    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      toast.warning(`You can only compare up to ${MAX_COMPARE_ITEMS} products`);
      return;
    }

    setCompareItems([...compareItems, product]);
    toast.success('Added to compare!');
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter(item => item._id !== productId));
    toast.info('Removed from compare');
  };

  const clearCompare = () => {
    setCompareItems([]);
    localStorage.removeItem('compare');
  };

  const value = {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    compareCount: compareItems.length
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};
