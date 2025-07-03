import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { dispatch } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:3000/products`)
      .then(res => {
        const found = res.data.find(p => p.id.toString() === id);
        if (found) setProduct(found);
        else toast.error('Product not found');
      })
      .catch(err => toast.error('Failed to load product detail'));
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  const handleAdd = () => {
    if (product.quantity <= 0) {
      toast.warn(`${product.name} is out of stock`);
      return;
    }
    dispatch({ type: 'ADD', payload: product });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
      <p className="mt-2 text-blue-600 font-semibold text-xl">${product.price}</p>
      <p className="mt-2 text-sm text-gray-500">Stock: {product.quantity}</p>
      <button
        onClick={handleAdd}
        disabled={product.quantity === 0}
        className={`mt-4 px-6 py-2 rounded text-white ${product.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
      >
        {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductDetail;
