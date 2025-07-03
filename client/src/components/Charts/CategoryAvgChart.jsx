import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CategoryAvgChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => {
        const grouped = {};
        res.data.forEach(p => {
          if (!grouped[p.category]) grouped[p.category] = [];
          grouped[p.category].push(p.price);
        });
        const avgData = Object.entries(grouped).map(([cat, prices]) => ({
          category: cat,
          avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
        }));
        setChartData(avgData);
      })
      .catch(err => console.error('Chart error:', err));
  }, []);

  return (
    <div className="mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Average Price by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryAvgChart;