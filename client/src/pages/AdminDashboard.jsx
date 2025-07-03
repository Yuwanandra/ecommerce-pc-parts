import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductStockChart from '../components/Charts/ProductStockChart';
import ExportCSV from '../components/Export/ExportCSV';
import CategoryAvgChart from '../components/Charts/CategoryAvgChart';
import ExportCSVButton from '../components/Admin/ExportCSVButton';

const AdminDashboard = () => {

    <ProductStockChart />
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [form, setForm] = useState({ name: '', price: '', stock: '', image: '', category: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:3000/api/products', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    toast.success('Product added');
    setForm({ name: '', price: '', stock: '', image: '', category: '' });
    fetchProducts();
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to add');
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this product?')) return;
  try {
    await axios.delete(`http://localhost:3000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    toast.success('Product deleted');
    fetchProducts();
  } catch (err) {
    toast.error('Delete failed');
  }
};

const [editId, setEditId] = useState(null);
const [editForm, setEditForm] = useState({});
const [query, setQuery] = useState('');

const startEdit = (product) => {
  setEditId(product.id);
  setEditForm(product);
};

const cancelEdit = () => setEditId(null);

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditForm(prev => ({ ...prev, [name]: value }));
};

const submitEdit = async () => {
  try {
    await axios.put(`http://localhost:3000/api/products/${editId}`, editForm, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    toast.success('Product updated');
    setEditId(null);
    fetchProducts();
  } catch (err) {
    toast.error('Update failed');
  }
};

const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

return (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-3xl font-bold mb-4">Admin: Product List</h1>
    <ExportCSVButton token={localStorage.getItem('token')} />
    <ExportCSV data={products} />
    <ExportCSV data={ProductStockChart} />
    <ExportCSV data={CategoryAvgChart} />

    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="p-2 border" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="p-2 border" />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="p-2 border" />
      <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 border" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="p-2 border" />
      <button className="col-span-2 bg-blue-600 text-white py-2 rounded">Add Product</button>
    </form>

    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search product..."
      className="p-2 border mb-4 w-full"
    />

    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Stock</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map(p => (
          <tr key={p.id}>
            <td className="border p-2">
              {editId === p.id ? (
                <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-1 w-full" />
              ) : p.name}
            </td>
            <td className="border p-2">
              {editId === p.id ? (
                <input name="price" value={editForm.price} onChange={handleEditChange} className="border p-1 w-full" />
              ) : `$${p.price}`}
            </td>
            <td className="border p-2">
              {editId === p.id ? (
                <input name="stock" value={editForm.stock} onChange={handleEditChange} className="border p-1 w-full" />
              ) : p.stock}
            </td>
            <td className="border p-2">
              {editId === p.id ? (
                <>
                  <button onClick={submitEdit} className="text-green-600 mr-2">Save</button>
                  <button onClick={cancelEdit} className="text-gray-600">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(p)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
);
};

export default AdminDashboard;