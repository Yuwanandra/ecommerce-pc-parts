import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: 'ADD', payload: { ...product, qty: 1 } });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.description}</p>
      <p className="text-blue-600 font-semibold mt-1">${product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>

      <button
        onClick={addToCart}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Beli
      </button>
    </div>
  );
};

export default ProductCard;