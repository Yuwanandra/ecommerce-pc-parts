import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      navigate(role === 'admin' ? '/admin' : '/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const res = await API.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      console.log('Login success:', res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.name);
      localStorage.setItem('role', res.data.role);
      toast.success('Login successful');
      navigate(res.data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-3 border rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-3 border rounded"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;