import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, dispatch } = useWishlist();

  const remove = (id) => dispatch({ type: 'REMOVE', payload: id });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map(item => (
            <li key={item.id} className="bg-white p-4 shadow rounded">
              <Link to={`/products/${item.id}`}>
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
                <h2 className="font-bold text-lg mt-2">{item.name}</h2>
              </Link>
              <div className="flex justify-between items-center mt-2">
                <span className="text-blue-600 font-semibold">${item.price}</span>
                <button onClick={() => remove(item.id)} className="text-red-600">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;