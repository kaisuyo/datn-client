import React from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import API from '../../../context/config';
import toastr from 'toastr';
import { useContext } from 'react';
import { UserContext } from '../../../context/AppContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
`;

const LoginFormStyled = styled(Form)`
  padding: 15px 30px 30px 30px;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const LoginFormTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const LoginFormButton = styled(Button)`
  width: 100%;
`;

const LoginPage = () => {
  const { setUser } = useContext(UserContext)
  const services = {
    login: (loginData) => {
      API.post('/users/login', loginData).then(res => {
        if (res.data.value) {
          setUser(res.data.value)
        } else {
          toastr.error("Đăng nhập thất bại")
        }
      }).catch(e => {
        console.error(e)
        toastr.error("Đăng nhập thất bại")
      })
    }
  }
  const onFinish = (values) => {
    services.login(values)
  };

  return (
    <LoginContainer>
      <LoginFormStyled onFinish={onFinish}>
        <LoginFormTitle>Đăng nhập</LoginFormTitle>
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
        <LoginFormButton type="primary" htmlType="submit">
          Đăng nhập
        </LoginFormButton>
        <div>Quên mật khẩu?</div>
        <span>Liên lạc <mark>0123456789</mark> để được cấp lại</span>
      </LoginFormStyled>
    </LoginContainer>
  );
};

export default LoginPage;
