import { Form, Modal, Button, Input, Typography, Space } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../App'

const { Text } = Typography

export default function Auth(props) {
  const { showAuth, setShowAuth } = props
  const { setUser } = useContext(AppContext)

  const handleCancel = () => {
    setShowAuth(0)
  }

  const handleFinish = (values) => {
    const { username } = values
    let role = 0
    if (['bac', 'Bac', 'bắc', 'Bắc'].includes(username)) {
      role = 1
    }
    setShowAuth(0)
    setUser({username: username, userId: 1, role})
  }

  return (
    <Modal
      title={showAuth === 1 ? "Đăng nhập" : "Đăng ký tạo tài khoản mới"} 
      open={showAuth !== 0} 
      onCancel={handleCancel}
      footer={null}
    >
      <Form onFinish={handleFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        {showAuth === 2 && <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Mật khẩu xác nhận không khớp!');
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>}
        <Form.Item style={{textAlign: "right"}}>
          <Space>
            <Button type="primary" htmlType="submit">
              {showAuth === 1 && "Đăng nhập"}
              {showAuth === 2 && "Đăng ký"}
            </Button>
            {showAuth === 1 && <Button onClick={() => setShowAuth(2)} type='link'>Đăng ký tài khoản mới</Button>}
            {showAuth === 2 && <Button onClick={() => setShowAuth(1)} type='link'>Màn hình đăng nhập</Button>}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
