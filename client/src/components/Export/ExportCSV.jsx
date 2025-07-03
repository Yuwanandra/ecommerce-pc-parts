import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { utils, writeFile } from 'xlsx';

const ExportCSV = ({ data }) => {
  const exportToCSV = () => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Products');
    writeFile(workbook, 'product-stock.csv');
  };

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
    >
      <FaDownload /> Export CSV
    </button>
  );
};

export default ExportCSV;
