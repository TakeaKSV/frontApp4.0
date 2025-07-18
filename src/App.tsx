
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './core/menuRoutes';
import MenuDynamic from './modules/dashboard/MenuDynamic';
import Logon from './modules/user/loginForm';
import UserData from './modules/user/userData';
import ProductData from './modules/product/productData';
import OrderData from './modules/order/orderData';
import AuthRoutes from './auth/authRoutes';
import { AuthProvider } from './auth/authProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Logon />} />
          <Route
            path="/*"
            element={
              <AuthRoutes>
                <MenuDynamic>
                  <Routes>
                    {routes.map((route, index) => (
                      <Route key={index} path={route.path} element={route.element} />
                    ))}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="get" element={<UserData />} />
                    <Route path="getp" element={<ProductData />} />
                    <Route path="getO" element={<OrderData />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </MenuDynamic>
              </AuthRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
