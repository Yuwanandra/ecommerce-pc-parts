import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './routes/AdminRoute';
import Contact from './pages/Contact';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <div className="bg-gray-100 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<><Hero /><ProductList /></>} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
