import { Input, Table, Button, message, Tag } from "antd";
import { useEffect, useState } from "react";
import ProductModelForm from "./productModalForm";
import ProductCreateModalForm from "./ProductCreateModalForm";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    fetch("https://backapp40-production.up.railway.app/api/getp")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(mapProductos(data));
        } else if (Array.isArray(data.productList)) {
          setProductos(mapProductos(data.productList));
        } else if (Array.isArray(data.products)) {
          setProductos(mapProductos(data.products));
        } else {
          setProductos([]);
        }
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setProductos([]);
      });
  }, []);

  const mapProductos = (arr) =>
    arr.map((producto) => ({
      key: producto._id || producto.id,
      name: producto.name || "",
      description: producto.description || "",
      amount: producto.amount || 0,
      price: producto.price || 0,
      createDate: producto.createDate ? new Date(producto.createDate).toLocaleDateString() : "",
      status: producto.status !== undefined ? producto.status : true,
      ...producto,
    }));

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleSave = async (updatedProduct) => {
    if (!updatedProduct?.key) return;

    try {
      const response = await fetch(`https://backapp40-production.up.railway.app/api/updatep/${updatedProduct.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      const result = await response.json();

      if (response.ok) {
        setProductos((prev) =>
          prev.map((producto) =>
            producto.key === updatedProduct.key
              ? { ...producto, ...updatedProduct }
              : producto
          )
        );
        message.success("Producto actualizado");
      } else {
        console.error("Error al actualizar producto:", result);
        message.error("Error al actualizar producto");
      }
    } catch (error) {
      console.error("Error en PUT de producto:", error);
      message.error("Error de conexión al actualizar");
    }

    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleCreate = async (newProductData) => {
    try {
      const response = await fetch("https://backapp40-production.up.railway.app/api/crearp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductData),
      });

      const result = await response.json();

      if (response.ok) {
        const newProduct = {
          key: result._id,
          ...result,
          createDate: new Date(result.createDate).toLocaleDateString(),
        };
        setProductos((prev) => [...prev, newProduct]);
        message.success("Producto creado exitosamente");
        setCreateModalVisible(false);
      } else {
        console.error("Error al crear producto:", result);
        message.error("Error al crear producto");
      }
    } catch (error) {
      console.error("Fallo al hacer POST:", error);
      message.error("Error de conexión al crear producto");
    }
  };

  const columnas = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Cantidad", dataIndex: "amount", key: "amount" },
    { title: "Precio", dataIndex: "price", key: "price", render: (v) => `$${v}` },
    { title: "Fecha de creación", dataIndex: "createDate", key: "createDate" },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      ),
    },
  ];

  const productosFiltrados = productos.filter((producto) =>
    producto.name?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <h1>Lista de Productos</h1>
      <div className="p-4">
        <Input.Search
          className="mb-4"
          placeholder="Buscar por nombre"
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          Agregar Producto
        </Button>
        <Table
          columns={columnas}
          dataSource={productosFiltrados}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
        <ProductModelForm
          visible={modalVisible}
          product={editingProduct}
          onCancel={() => setModalVisible(false)}
          onSave={handleSave}
        />
        <ProductCreateModalForm
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onCreate={handleCreate}
        />
      </div>
    </>
  );
}
