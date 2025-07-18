// appweb4/front/src/modules/dashboard/menuDynamic.tsx

import React, { useState } from "react";
import { useAuth } from "../../auth/authProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd"; // Importa Layout, Menu y Button de antd
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ShoppingOutlined, // Icono para Productos
  ContainerOutlined, // Icono para Órdenes (cambiado de UnorderedListOutlined por uno más común para órdenes)
  FileTextOutlined, // Icono para Reportes (si lo tienes)
} from "@ant-design/icons";

const { Sider, Content } = Layout; // Desestructuramos Sider y Content de Layout

// Mapa de nombres de iconos a componentes de icono de Ant Design
const Icons: { [key: string]: React.ComponentType } = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  FileTextOutlined,
};

// Define la interfaz para un elemento de menú dinámico
interface DynamicMenuItem {
  title: string;
  path: string;
  icon: string;
  roles?: string[];
}

// Interfaz para las props de MenuDynamic, ahora recibirá 'children'
interface MenuDynamicProps {
  children?: React.ReactNode; // El contenido de la página se pasará aquí
}

const MenuDynamic: React.FC<MenuDynamicProps> = ({ children }) => {
  // Menú estático para mostrar todos los módulos principales
  const [menuItems] = useState<DynamicMenuItem[]>([
    { title: 'Dashboard', path: '/dashboard', icon: 'DashboardOutlined' },
    { title: 'Usuarios', path: '/get', icon: 'UserOutlined' },
    { title: 'Productos', path: '/getp', icon: 'ShoppingOutlined' },
    { title: 'Órdenes', path: '/getO', icon: 'ContainerOutlined' },
    { title: 'Reportes', path: '/reportes', icon: 'FileTextOutlined' },
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/menus?userId=685bf7d590f89fe7fa2264ff")
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Error al obtener el menú");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Respuesta de la API de menús:", data);
  //       if (Array.isArray(data.menus)) {
  //         setMenuItems(data.menus);
  //       } else {
  //         setMenuItems([]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error cargando el menú:", err);
  //       setMenuItems([]);
  //     });
  // }, []);

  const renderMenu = () => {
    if (!Array.isArray(menuItems)) return [];
    return menuItems.map((item) => {
      const IconComponent = Icons[item.icon];
      return {
        key: item.path,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.title,
      };
    });
  };

  const { logout } = useAuth();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible style={{ overflow: "auto" }}>
        <div className="demo-logo-vertical" style={{ height: "32px", margin: "16px", background: "rgba(255, 255, 255, 0.2)", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
          Mi App
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={renderMenu()}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        {/* Header con botón de logout */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', background: '#fff', padding: '8px 24px', borderBottom: '1px solid #eee' }}>
          <Button type="primary" danger onClick={logout} style={{ marginLeft: 'auto' }}>
            Cerrar sesión
          </Button>
        </div>
        <Content style={{ margin: "24px 16px", padding: "24px", background: "#fff", minHeight: "280px" }}>
          {children}
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};

export default MenuDynamic;