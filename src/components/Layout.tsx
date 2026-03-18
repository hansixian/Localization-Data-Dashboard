import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
