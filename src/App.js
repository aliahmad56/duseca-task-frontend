import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppRoutes from './Routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './ProtectedRoute';

import { AuthProvider } from '../src/context/auth.context';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
