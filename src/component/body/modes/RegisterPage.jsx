import React, { useContext } from 'react';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { UserContext } from '../../../context/AppContext';
import toastr from 'toastr'
import API from '../../../context/config';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 150px;
`;

const RegisterFormStyled = styled(Form)`
  padding: 15px 30px 30px 30px;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const RegisterFormTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const RegisterFormButton = styled(Button)`
  width: 100%;
`;

const RegisterPage = () => {
  const { user, setUser } = useContext(UserContext)

  const services = {
    signUp: (signUpData) => {
      API.post('/users/signUp', signUpData).then(res => {
        if (res.data.value) {
          setUser(res.data.value)
        } else {
          toastr.error(res.data.message)
        }
      }).catch(e => {
        console.error(e)
        toastr.error("Đã có lỗi xử lý server")
      })
    },
    // createAdmin: (createAdminData) => {
    //   API.post('/users/createAdmin', createAdminData).then(res => {
    //     if (res.data.value) {
    //       toastr.info("Đã tạo tài khoản admin thành công")
    //     } else {
    //       toastr.error(res.data.message)
    //     }
    //   }).catch(e => {
    //     console.error(e)
    //     toastr.error("Đã có lỗi xử lý server")
    //   })
    // },
    // getAccount: () => {

    // }
  }
  const onFinish = (values) => {
    services.signUp(values)
  };

  return (
    <RegisterContainer>
      <RegisterFormStyled onFinish={onFinish}>
        <RegisterFormTitle>Đăng ký</RegisterFormTitle>
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
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Mật khẩu không khớp!');
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>
        <RegisterFormButton type="primary" htmlType="submit">
          Đăng ký
        </RegisterFormButton>
        <br />
        <div>Liên lạc <mark>0123456789</mark></div>
        <span>để trở thành nhà cung cấp khóa học</span>
      </RegisterFormStyled>
    </RegisterContainer>
  );
};

export default RegisterPage;
