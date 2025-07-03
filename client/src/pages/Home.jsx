import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products', err));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {products.map(product => (
        <div key={product.id} className="border rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-400">Stock: {product.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;