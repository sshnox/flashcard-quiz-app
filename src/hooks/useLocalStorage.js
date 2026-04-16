import { useState, useEffect } from 'react';

/**
 * A React hook that persists state to localStorage.
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (err) {
      console.error(`useLocalStorage: error reading "${key}"`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`useLocalStorage: error writing "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
};
