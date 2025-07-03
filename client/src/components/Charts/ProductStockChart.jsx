import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProductStockChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => setData(res.data))
      .catch(err => console.error('Chart load failed:', err));
  }, []);

  return (
    <div className="mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Product Stock Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} dy={10} height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductStockChart;