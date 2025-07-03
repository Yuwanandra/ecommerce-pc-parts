import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductList = () => {
  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchProducts = () => {
    axios.get('http://localhost:3000/api/products') // ✅ DB route
      .then(res => setProducts(res.data))
      .catch(err => toast.error('Failed to load products'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === 'All' || p.category === filter;
    return matchQuery && matchFilter;
  });

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">All PC Parts</h2>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option>All</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
