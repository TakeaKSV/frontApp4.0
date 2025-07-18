import { Input, Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import UserModalForm from "./userModalForm";
import UserCreateModalForm from "./UserCreateModalForm";

export default function UserData() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://backapp40-production.up.railway.app/api/getAllUsers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(mapUsers(data));
        } else if (Array.isArray(data.userList)) {
          setUsers(mapUsers(data.userList));
        } else if (Array.isArray(data.users)) {
          setUsers(mapUsers(data.users));
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  const mapUsers = (dataArray) =>
    dataArray.map((user) => ({
      key: user._id || user.id,
      name: user.name || "",
      email: user.email || "",
      ...user,
    }));

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleSave = async (updatedUser) => {
    if (!updatedUser?.key) return;

    try {
      const response = await fetch(`https://backapp40-production.up.railway.app/api/update/${updatedUser.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const result = await response.json();

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.key === updatedUser.key ? { ...user, ...updatedUser } : user
          )
        );
        message.success("Usuario actualizado");
      } else {
        console.error("Error al actualizar usuario:", result);
        message.error("Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Fallo al hacer PUT:", error);
      message.error("Error de conexión al actualizar");
    }

    setModalVisible(false);
    setEditingUser(null);
  };

  const handleCreate = async (newUserData) => {
    try {
      const response = await fetch("https://backapp40-production.up.railway.app/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      const result = await response.json();

      if (response.ok) {
        const newUser = {
          key: result.user._id,
          ...result.user,
        };
        setUsers((prev) => [...prev, newUser]);
        message.success("Usuario creado exitosamente");
        setCreateModalVisible(false);
      } else {
        console.error("Error al crear usuario:", result);
        message.error("Error al crear usuario");
      }
    } catch (error) {
      console.error("Fallo al hacer POST:", error);
      message.error("Error de conexión al crear usuario");
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name && user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1>Lista de Usuarios</h1>
      <div className="p-4">
        <Input.Search
          className="mb-4"
          placeholder="Buscar por nombre"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          style={{ marginBottom: 16, marginTop: 16 }}
        >
          Agregar Usuario
        </Button>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 6 }}
          rowKey="key"
        />
        <UserModalForm
          visible={modalVisible}
          user={editingUser}
          onCancel={() => setModalVisible(false)}
          onSave={handleSave}
        />
        <UserCreateModalForm
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onCreate={handleCreate}
        />
      </div>
    </>
  );
}
