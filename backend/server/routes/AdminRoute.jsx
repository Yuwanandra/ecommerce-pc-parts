import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const isAdmin = user === 'admin'; // for now, basic match

  return token && isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
