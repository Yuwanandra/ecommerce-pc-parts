import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE', payload: id });
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
    toast.warn('Cart cleared');
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      const products = cart.map(item => ({
        product_id: Number(item.id),     // ✅ pastikan angka
        quantity: Number(item.qty)       // ✅ pastikan angka
      }));

      const res = await API.post('/orders', {
        products,
        total: totalPrice
      });

      dispatch({ type: 'CLEAR' });
      toast.success('Order placed');
      navigate('/order-success');
    } catch (err) {
      toast.error('Checkout failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map(item => (
              <li key={item.id} className="bg-white p-4 rounded shadow flex justify-between">
                <span>{item.name} x{item.qty}</span>
                <span>Rp {item.price * item.qty}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold text-xl my-4">
            Total: Rp {totalPrice}
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/checkout')}
            className="bg-green-600 text-white px-6 py-2 rounded">
              Checkout
            </button>
            <button onClick={clearCart} className="bg-red-600 text-white px-6 py-2 rounded">
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
