// appweb4/front/src/core/menuRoutes.tsx

import React from 'react';
// import { RouteObject } from 'react-router-dom'; // No es estrictamente necesario si solo tipas con RouteApp

// ===================================================================================
// IMPORTACIONES DE TUS COMPONENTES DE PÁGINAS
// ===================================================================================
import Dashboard from '../modules/dashboard/dashboard';
import UserForm from '../modules/user/userForm';
import Order from '../modules/order/order';
import Product from '../modules/product/product';
import Report from '../modules/report/report'; // ¡NUEVA IMPORTACIÓN para Reportes!

// Definición de la interfaz para las rutas
export interface RouteApp {
  path: string;
  element: React.ReactElement;
  label?: string;
  icon?: string;
  roles?: string[];
  hidden?: boolean;
}

// ===================================================================================
// DEFINICIÓN DE TUS RUTAS
// ===================================================================================
export const routes: RouteApp[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    label: 'Dashboard',
  },
  {
    path: '/usuarios',
    element: <UserForm />,
    label: 'Usuarios',
  },
  {
    path: '/productos',
    element: <Product />,
    label: 'Productos',
  },
  {
    path: '/ordenes',
    element: <Order />,
    label: 'Órdenes',
  },
  {
    path: '/reportes', // ¡NUEVA RUTA para Reportes!
    element: <Report />, // Usa el componente Report que acabas de crear
    label: 'Reportes',
  },
];

// No hay una exportación por defecto en este archivo, se exporta el array 'routes'.