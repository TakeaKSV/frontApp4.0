import React, { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";

interface Product {
  key: string;
  name: string;
  amount: number;
  [key: string]: any;
}

interface ProductModelFormProps {
  visible: boolean;
  product: Product | null;
  onCancel: () => void;
  onSave: (product: Product) => void;
}

const ProductModelForm: React.FC<ProductModelFormProps> = ({
  visible,
  product,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const validationTimeoutRef = useRef<number>(); // ✅ CAMBIADO

  // Solo establecer valores cuando el modal se abre
  useEffect(() => {
    if (visible) {
      if (product) {
        form.setFieldsValue({
          name: product.name,
          amount: product.amount
        });
        // Si hay producto, validar inmediatamente
        setTimeout(() => checkFormValidity(), 50);
      } else {
        form.resetFields();
        // Si no hay producto, el formulario está vacío = inválido
        setIsValid(false);
      }
    } else {
      // Resetear validez cuando se cierra
      setIsValid(false);
    }
  }, [visible, product?.key]);

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

  const handleOk = () => {
    // Si ya sabemos que es válido, no re-validar
    if (!isValid) return;
    
    // Limpiar timeout pendiente para evitar conflictos
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    // Obtener valores directamente del formulario
    const values = form.getFieldsValue();
    const productData = product 
      ? { ...product, ...values }
      : { ...values, key: Date.now().toString() };
    
    onSave(productData);
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
      title={product ? "Editar producto" : "Crear producto"}
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
          label="Nombre del producto"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Ingrese el nombre del producto" />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Cantidad"
          rules={[
            { required: true, message: "La cantidad es obligatoria" },
            { type: "number", min: 0, message: "Debe ser un número positivo" },
          ]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="Ingrese la cantidad"
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModelForm;