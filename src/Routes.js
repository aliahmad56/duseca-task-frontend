// src/AppRoutes.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/auth.context';

import Signin from './pages/Singin';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserDashboard from './pages/Home';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'manager') return '/manager';
    return '/';
  };

  return (
    <Routes>
      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Manager Route */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      {/* User Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Signin Route */}
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to={getDashboardPath()} /> : <Signin />}
      />
    </Routes>
  );
};

export default AppRoutes;
