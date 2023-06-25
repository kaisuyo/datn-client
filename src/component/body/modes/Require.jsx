import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import styled from 'styled-components';
import API from '../../../context/config';
import toastr from 'toastr';
import { useEffect } from 'react';

const RequirePageStyled = styled.div`
  padding: 16px;
`

const StyledTable = styled(Table)`
  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }
  tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }
`;

export default function Require() {
  const [requires, setRequires] = useState([]);

  const getAllRequires = () => {
    API.get('/courses/requires').then(res => {
      if (res.data.value) {
        setRequires(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  }

  useEffect(() => {
    getAllRequires()
  }, [])

  const handleBlock = (id) => {
    API.post('/courses/blockRegis', {waitId: id}).then(res => {
      if (res.data.value) {
        getAllRequires()
        toastr.success("Xử lý yêu cầu thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  };

  const handleAlow = (id) => {
    API.post('/courses/alowRegis', {waitId: id}).then(res => {
      if (res.data.value) {
        getAllRequires()
        toastr.success("Xử lý yêu cầu thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  }

  // Cấu hình bảng
  const columns = [
    {
      title: 'Id',
      dataIndex: 'waitId',
      key: 'waitId',
      width: 100,
    },
    {
      title: 'Người yêu cầu',
      dataIndex: 'fromUser',
      key: 'fromUser',
      width: 160,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (text, record) => (
        <Space>
          <Popconfirm 
            placement="left"
            title="Xác nhận yêu cầu"
            description={`Bạn đồng ý với yêu cầu này ?`}
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={() => handleAlow(record.waitId)}
            onCancel={() => handleBlock(record.waitId)}
          >
            <Button type="primary">
              Xử lý
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <RequirePageStyled>
      <StyledTable 
        dataSource={requires}
        columns={columns} 
        bordered 
        pagination={{
          pageSize: 8,
        }} 
      />
    </RequirePageStyled>
  );
};
