import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Select, Button, Input } from "antd";

interface OrderCreateModalFormProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (orderData: any) => void;
}

const OrderCreateModalForm: React.FC<OrderCreateModalFormProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const data = {
          ...values,
          createDate: new Date().toISOString(),
        };
        onCreate(data);
      })
      .catch(() => {});
  };

  return (
    <Modal
      open={visible}
      title="Crear Nueva Orden"
      onCancel={onCancel}
      onOk={handleOk}
      footer={[
        <Button onClick={onCancel}>Cancelar</Button>,
        <Button type="primary" onClick={handleOk}>
          Crear
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="user"
          label="ID del Usuario"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input placeholder="Ej: 64a1234abc1234567890abcd" />
        </Form.Item>
        <Form.Item
          name="subtotal"
          label="Subtotal"
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="total"
          label="Total"
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Estado"
          initialValue={true}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={true}>Activa</Select.Option>
            <Select.Option value={false}>Cancelada</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderCreateModalForm;
