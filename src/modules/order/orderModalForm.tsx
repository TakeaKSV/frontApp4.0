import React, { useEffect, useState, useRef } from "react";
import { Modal, Form, InputNumber, Select, Button } from "antd";

interface Order {
  key: string;
  subtotal: number;
  total: number;
  status: boolean;
  [key: string]: any;
}

interface OrderModalFormProps {
  visible: boolean;
  order: Order | null;
  onCancel: () => void;
  onSave: (order: Order) => void;
}

const OrderModalForm: React.FC<OrderModalFormProps> = ({
  visible,
  order,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);
  const validationTimeoutRef = useRef<number | undefined>(undefined);

  // Solo establecer valores cuando el modal se abre
  useEffect(() => {
    if (visible) {
      if (order) {
        form.setFieldsValue({
          subtotal: order.subtotal,
          total: order.total,
          status: order.status
        });
        // Si hay orden, validar inmediatamente
        window.setTimeout(() => checkFormValidity(), 50);
      } else {
        form.resetFields();
        // Si no hay orden, el formulario está vacío = inválido
        setIsValid(false);
      }
    } else {
      // Resetear validez cuando se cierra
      setIsValid(false);
    }
  }, [visible, order?.key]);

  // Función para validar el formulario con debounce
  const checkFormValidity = () => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = window.setTimeout(() => {
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
    const orderData = order
      ? { ...order, ...values, status: values.status === true }
      : { ...values, key: Date.now().toString(), status: values.status === true };

    onSave(orderData);
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
      title={order ? "Editar Orden" : "Crear Orden"}
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
          name="subtotal"
          label="Subtotal"
          rules={[
            { required: true, message: "El subtotal es obligatorio" },
            { type: "number", min: 0, message: "Debe ser un número positivo" }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Ingrese el subtotal"
            min={0}
            step={0.01}
            precision={2}
          />
        </Form.Item>
        <Form.Item
          name="total"
          label="Total"
          rules={[
            { required: true, message: "El total es obligatorio" },
            { type: "number", min: 0, message: "Debe ser un número positivo" }
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Ingrese el total"
            min={0}
            step={0.01}
            precision={2}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Estado"
          rules={[{ required: true, message: "Seleccione un estado" }]}
        >
          <Select placeholder="Seleccione el estado de la orden">
            <Select.Option value={true}>Activa</Select.Option>
            <Select.Option value={false}>Cancelada</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderModalForm;