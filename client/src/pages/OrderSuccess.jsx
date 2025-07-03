import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => (
  <div className="p-8 text-center">
    <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Order Placed!</h1>
    <p className="text-lg mb-6">Thank you for your purchase. Your order is being processed.</p>
    <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded">
      Back to Home
    </Link>
  </div>
);

export default OrderSuccess;
