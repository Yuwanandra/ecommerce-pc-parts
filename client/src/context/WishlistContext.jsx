import React, { createContext, useContext, useEffect, useReducer } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return state.find(item => item.id === action.payload.id) ? state : [...state, action.payload];
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);
    case 'SET':
      return action.payload;
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, []);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) dispatch({ type: 'SET', payload: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);