import { Form, Input, Button, message } from 'antd';

function UserForm() {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log('Formulario válido:', values);
            message.success('Formulario enviado correctamente');
            // Aquí puedes manejar el envío, por ejemplo, a una API
        } catch (errorInfo) {
            console.log('Errores de validación:', errorInfo);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Form</h2>

            <Form form={form} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                >
                    <Input placeholder="Enter your name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Enter a valid email address' }
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please enter your phone number' },
                        { pattern: /^\d{10}$/, message: 'Phone must be 10 digits' }
                    ]}
                >
                    <Input placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UserForm