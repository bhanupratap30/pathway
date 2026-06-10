import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

export const PortalGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access Denied. Advisor/Admin portal privileges required.', {
        id: 'access-denied-admin'
      });
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PortalGuard;
