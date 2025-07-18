import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authProvider';

export default function AuthRoutes({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}