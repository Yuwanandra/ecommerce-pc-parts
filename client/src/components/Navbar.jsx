import React from 'react';
import { FaDesktop, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const wishlistQty = wishlist.length;
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('user');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
        <FaDesktop className="mr-2" /> PC Parts
      </Link>
      <ul className="flex gap-6 items-center">
        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
        <li><Link to="/wishlist" className="hover:text-blue-600 flex items-center">
          <FaHeart className="mr-1" /> Wishlist
          {wishlistQty > 0 && (
            <span className="ml-1 bg-pink-600 text-white rounded-full px-2 py-0.5 text-xs">{wishlistQty}</span>
          )}
        </Link></li>
        <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
        <li><Link to="/cart" className="hover:text-blue-600 flex items-center">
          <FaShoppingCart className="mr-1" /> Cart
          {cartQty > 0 && (
            <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">{cartQty}</span>
          )}
        </Link></li>
        {!isLoggedIn ? (
          <>
            <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
          </>
        ) : (
          <>
            <li className="text-gray-600">Hi, {username}</li>
            <li><button onClick={logout} className="text-red-600">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
