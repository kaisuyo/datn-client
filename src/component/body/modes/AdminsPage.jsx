import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import styled from 'styled-components';
import API from '../../../context/config';
import toastr from 'toastr';
import { useEffect } from 'react';
import { ROLE } from '../../../context/enum';


// Tạo một styled component để custom giao diện
const AddAdminForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const AdminPageStyled = styled.div`
  padding-left: 16px;
  padding-right: 16px;

  .btn-add {
    width: 100%;
    text-align: right;
    padding: 8px 0;
  }
`

const StyledTable = styled(Table)`
  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }
  tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }
`;

const BtnInfo = styled(Button)`
  background: #01d101;

  &:hover {
    background: #01d101 !important;
    opacity: 0.6;
  }
`

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalAdd, setIsModalAdd] = useState(false);

  // Các trường trong form thêm môn học
  const [form] = Form.useForm();

  useEffect(() => {
    API.post(`system/users`, {roleType: ROLE.APPROVER}).then(res => {
      if (res.data.value) {
        setAdmins(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error('Có lỗi trong quá trình xử lý')
    })
  }, [])

  // Xử lý submit form thêm admin
  const handleAddAdmin = (values) => {
    API.post(`system/users/create`, {...values, roleType: ROLE.APPROVER}).then(res => {
      if (res.data.value) {
        const admin = res.data.value
        setAdmins([...admins, admin]);
        form.resetFields();
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error('Có lỗi trong quá trình xử lý')
    }).finally(() => {
      setIsModalAdd(false);
    })
  };

  const handleDeleteAdmin = (id) => {
    API.post('system/users/delete', {userId: id}).then(res => {
      if (res.data.value) {
        setAdmins(admins.filter((ad) => ad.subjectId !== id));
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  };

  const handleResetPass = (id) => {
    API.post('system/users/resetPass', {userId: id}).then(res => {
      toastr.success(res.data.message)
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  };

  const handleBlock = (id) => {
    API.post('system/users/block', {userId: id}).then(res => {
      if (res.data.value) {
        const updatedAdmins = admins.map(ad =>
          ad.userId === id ? {...ad, userId: id, status: 0} : ad
        );
        setAdmins(updatedAdmins);
        form.resetFields();
        toastr.success("Khóa tài khoản thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  };

  const handleUnblock = (id) => {
    API.post('system/users/unblock', {userId: id}).then(res => {
      if (res.data.value) {
        const updatedAdmins = admins.map(ad =>
          ad.userId === id ? {...ad, userId: id, status: 1} : ad
        );
        setAdmins(updatedAdmins);
        form.resetFields();
        toastr.success("Khóa tài khoản thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  };

  // Cấu hình bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: "Trạng thái",
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Space>
          <Popconfirm 
            placement="bottom"
            title={record.status === 1 ? "Khóa tài khoản" : "Mở khóa tài khoản"}
            description={`${record.status === 1 ? "Bạn muốn khóa tài khoản" : "Bạn muốn mở khóa tài khoản"} ${record.username}`}
            okText={`${record.status === 1 ? "Khóa":"Mở khóa"}`}
            cancelText="Không"
            onConfirm={() => {record.status === 1 ? handleBlock(record.userId) : handleUnblock(record.userId)}}
          >
            {record.status === 1 ? 
              <BtnInfo type="primary">
                Hoạt động
              </BtnInfo> : 
              <Button danger type="primary">
                Đã khóa
              </Button>}
          </Popconfirm>
        </Space>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 300,
      render: (text, record) => (
        <Space>
          <Popconfirm 
            placement="left"
            title="Reset mật khẩu"
            description={`Bạn chắc chắn muốn đưa mật khẩu về mặc định (0) ?`}
            okText="Reset"
            cancelText="Không"
            onConfirm={() => handleResetPass(record.userId)}
          >
            <Button type="primary">
              Reset mật khẩu
            </Button>
          </Popconfirm>
          
          <Popconfirm 
            placement="bottomLeft"
            title="Xóa tài khoản"
            description={`Bạn chắc chắn muốn xóa tài khoản ${record.username} ?`}
            okText="Xóa"
            cancelText="Không"
            onConfirm={() => handleDeleteAdmin(record.userId)}
          >
            <Button danger>
              Xóa tài khoản
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminPageStyled>
      <div className="btn-add">
        <Button type="primary" onClick={() => setIsModalAdd(true)}>
          Tạo tài khoản phụ trách duyệt khóa học
        </Button>
      </div>
      <StyledTable 
        dataSource={admins}
        columns={columns} 
        bordered 
        pagination={{
          pageSize: 5,
        }} 
      />

      <Modal
        title="Tạo tài khoản phụ trách duyệt khóa học"
        open={isModalAdd}
        onCancel={() => setIsModalAdd(false)}
        onOk={form.submit}
      >
        <AddAdminForm 
          form={form} 
          onFinish={(values) => {handleAddAdmin(values)}}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đang nhập!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nhập mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Nhập mật khẩu"
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
            <Input.Password />
          </Form.Item>
        </AddAdminForm>
      </Modal>
    </AdminPageStyled>
  );
};

export default AdminsPage;
