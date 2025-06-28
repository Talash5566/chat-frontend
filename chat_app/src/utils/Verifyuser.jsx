import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const Verifyuser = () => {
  const { authUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; 
  }
  
  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
};