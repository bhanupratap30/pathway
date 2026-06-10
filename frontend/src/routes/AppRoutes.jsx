import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Recommendation from '../pages/Recommendation';
import Submissions from '../pages/Submissions';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import AuthGuard from '../components/Common/AuthGuard';
import PortalGuard from '../components/Common/PortalGuard';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Portal */}
      <Route path="/login" element={<Login />} />

      {/* Protected Student Routes */}
      <Route 
        path="/" 
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        } 
      />
      <Route 
        path="/recommendation" 
        element={
          <AuthGuard>
            <Recommendation />
          </AuthGuard>
        } 
      />

      {/* Protected Advisor/Admin Routes */}
      <Route 
        path="/submissions" 
        element={
          <AuthGuard>
            <PortalGuard>
              <Submissions />
            </PortalGuard>
          </AuthGuard>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <AuthGuard>
            <PortalGuard>
              <Dashboard />
            </PortalGuard>
          </AuthGuard>
        } 
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
