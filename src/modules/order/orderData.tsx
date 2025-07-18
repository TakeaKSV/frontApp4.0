import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import OrderModalForm from "./OrderModalForm";
import OrderCreateModalForm from "./OrderCreateModalForm";

export default function OrderData() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);

  useEffect(() => {
    fetch("https://backapp40-production.up.railway.app/api/getO")
      .then((res) => res.json())
      .then((data) => {
        setOrders(
          Array.isArray(data)
            ? data.map((order) => ({
                ...order,
                key: order._id,
              }))
            : []
        );
        console.log("Respuesta del backend:", data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEdit = (order) => {
    setEditingOrder(order);
    setModalVisible(true);
  };

  const handleSave = async (updatedOrder) => {
    if (!updatedOrder?.key) return;

    try {
      const response = await fetch(
        `https://backapp40-production.up.railway.app/api/updateO/${updatedOrder.key}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.key === updatedOrder.key ? { ...o, ...updatedOrder } : o
          )
        );
      } else {
        console.error("Error al actualizar orden:", result);
      }
    } catch (error) {
      console.error("Error en PUT de orden:", error);
    }

    setModalVisible(false);
    setEditingOrder(null);
  };

  const handleCreate = async (orderData) => {
    try {
      const response = await fetch("http://localhost:3000/api/crearO", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        setOrders((prev) => [...prev, { ...result, key: result._id }]);
        setCreateVisible(false);
      } else {
        console.error("Error al crear orden:", result);
      }
    } catch (error) {
      console.error("Fallo en POST:", error);
    }
  };

  const columns = [
    {
      title: "Usuario (ID)",
      dataIndex: "userId",
      key: "userId",
      render: (_, record) => record.user || record.userId || record._id,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Activa" : "Cancelada"),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Lista de Órdenes</h2>
      <Button
        type="primary"
        onClick={() => setCreateVisible(true)}
        style={{ marginBottom: 16, marginTop: 16 }}
      >
        Crear Orden
      </Button>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 6 }}
      />
      <OrderModalForm
        visible={modalVisible}
        order={editingOrder}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
      />
      <OrderCreateModalForm
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
