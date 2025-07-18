import React, { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Button } from "antd";

interface UserCreateModalFormProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (userData: any) => void;
}

const UserCreateModalForm: React.FC<UserCreateModalFormProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const validationTimeoutRef = useRef<number>(); // Cambiar NodeJS.Timeout por number

  // Resetear formulario cuando se cierra el modal
  useEffect(() => {
    if (visible) {
      form.resetFields();
      // Para crear usuario, inicialmente inválido (formulario vacío)
      setIsValid(false);
    } else {
      setIsValid(false);
    }
  }, [visible]);

  // Función para validar el formulario con debounce
  const checkFormValidity = () => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    validationTimeoutRef.current = setTimeout(() => {
      form.validateFields()
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false));
    }, 200);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
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
      title="Agregar nuevo usuario"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="create" type="primary" onClick={handleOk} disabled={!isValid}>
          Crear
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
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'Por favor ingrese una contraseña' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
          ]}
        >
          <Input.Password placeholder="Ingrese la contraseña (mín. 6 caracteres)" />
        </Form.Item>
        <Form.Item 
          name="rol" 
          label="Rol" 
          rules={[{ required: true, message: 'Por favor ingrese el rol' }]}
        >
          <Input placeholder="Ingrese el rol del usuario" />
        </Form.Item>
        <Form.Item 
          name="phone" 
          label="Teléfono"
        >
          <Input placeholder="Ingrese el teléfono (opcional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateModalForm;