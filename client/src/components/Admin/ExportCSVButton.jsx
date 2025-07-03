import React from 'react';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';

const ExportCSVButton = ({ token }) => {
  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      <FaDownload /> Export Orders CSV
    </button>
  );
};

export default ExportCSVButton;