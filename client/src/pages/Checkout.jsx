import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    const snapScript = document.createElement('script');
    snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    snapScript.setAttribute('data-client-key', 'Mid-client-PRvNJvKKlqn9N6pa');
    document.body.appendChild(snapScript);

    return () => {
      document.body.removeChild(snapScript);
    };
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const products = cart.map(item => ({
        product_id: item.id,
        quantity: item.qty
      }));

      // ✅ Step 1: Buat order dan dapatkan order_id
      const orderRes = await API.post('/orders', {
        products,
        total: Math.round(totalPrice)
      }, { headers });

      const order_id = orderRes.data.order_id;

      // ✅ Step 2: Buat token Midtrans
      const midtransRes = await API.post('/midtrans/token', {
        products,
        total: Math.round(totalPrice)
      }, { headers });

      const snapToken = midtransRes.data.token;

      // ✅ Step 3: Bayar
      window.snap.pay(snapToken, {
        onSuccess: async (result) => {
  console.log('📦 Payment result:', result); // tambahkan ini
  try {
    await API.post('/payment/success', {
      order_id: result.order_id,
      method: result.payment_type,
      status: result.transaction_status
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

            toast.success('Payment successful!');
            dispatch({ type: 'CLEAR' });
            navigate('/order-success');
          } catch (err) {
            toast.error('Payment saved failed');
          }
        },
        onError: () => toast.error('Payment failed'),
        onClose: () => toast.warn('Payment popup closed')
      });
    } catch (err) {
      toast.error('Checkout failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-2">Total: Rp {totalPrice}</p>
      <button onClick={handlePayment} className="bg-blue-600 text-white px-6 py-3 rounded">
        Pay with Midtrans
      </button>
    </div>
  );
};

export default Checkout;
