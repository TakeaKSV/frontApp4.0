import React, { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, InputNumber, Button, Switch } from "antd";

interface ProductCreateModalFormProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (productData: any) => void;
}

const ProductCreateModalForm: React.FC<ProductCreateModalFormProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const validationTimeoutRef = useRef<number>(); // ✅ OK

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (visible) {
      form.resetFields();
      // Para crear producto, inicialmente inválido (formulario vacío)
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

    validationTimeoutRef.current = window.setTimeout(() => { // ✅ CAMBIADO
      form.validateFields()
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false));
    }, 200);
  };

  const handleOk = () => {
    // Si ya sabemos que es válido, no re-validar
    if (!isValid) return;

    // Limpiar timeout pendiente para evitar conflictos
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Obtener valores directamente del formulario
    const values = form.getFieldsValue();
    const product = {
      ...values,
      createDate: new Date().toISOString(),
      key: Date.now().toString(), // Agregar key para el producto
    };
    onCreate(product);
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
      title="Agregar producto"
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
          label="Nombre del producto"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Ingrese el nombre del producto" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
        >
          <Input.TextArea
            placeholder="Ingrese una descripción del producto (opcional)"
            rows={3}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Cantidad"
          rules={[
            { required: true, message: "Cantidad obligatoria" },
            { type: "number", min: 0, message: "Debe ser un número positivo" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Ingrese la cantidad"
            min={0}
          />
        </Form.Item>
        <Form.Item
          name="price"
          label="Precio"
          rules={[
            { required: true, message: "Precio obligatorio" },
            { type: "number", min: 0, message: "Debe ser un número positivo" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Ingrese el precio"
            min={0}
            step={0.01}
            precision={2}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Estado"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductCreateModalForm;