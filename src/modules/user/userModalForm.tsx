import React, { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Button } from "antd";

interface User {
  key: string; // ← usamos "key" como ID
  name: string;
  email: string;
  [key: string]: any; // para admitir campos extra
}

interface UserModalFormProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onSave: (user: User) => void;
}

const UserModalForm: React.FC<UserModalFormProps> = ({
  visible,
  user,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const validationTimeoutRef = useRef<number>(); // ✅ OK

  // Solo establecer valores cuando el modal se abre
  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({
          name: user.name,
          email: user.email
        });
        // Si hay usuario, validar inmediatamente
        window.setTimeout(() => checkFormValidity(), 50); // ✅ CAMBIADO
      } else {
        form.resetFields();
        // Si no hay usuario, el formulario está vacío = inválido
        setIsValid(false);
      }
    } else {
      // Resetear validez cuando se cierra
      setIsValid(false);
    }
  }, [visible, user?.key]);

  // Función para validar el formulario con debounce
  const checkFormValidity = () => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    validationTimeoutRef.current = window.setTimeout(() => { // ✅ CAMBIADO
      form.validateFields()
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false));
    }, 200);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const userData = user 
        ? { ...user, ...values }
        : { ...values, key: Date.now().toString() };
      
      onSave(userData);
    } catch (error) {
      // Error de validación, no hacer nada
    }
  };

  const handleCancel = () => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    form.resetFields();
    setIsValid(false);
    onCancel();
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Modal
      open={visible}
      title={user ? "Editar usuario" : "Crear usuario"}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleOk} disabled={!isValid}>
          Guardar
        </Button>,
      ]}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFieldsChange={checkFormValidity}
      >
        <Form.Item 
          name="name" 
          label="Nombre" 
          rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
        >
          <Input placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Correo"
          rules={[
            { required: true, message: 'Por favor ingrese el correo' },
            { type: "email", message: 'Por favor ingrese un correo válido' }
          ]}
        >
          <Input placeholder="Ingrese el correo electrónico" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModalForm;