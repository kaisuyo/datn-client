import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import styled from 'styled-components';
import API from '../../../context/config';
import toastr from 'toastr';
import { useEffect } from 'react';


// Tạo một styled component để custom giao diện
const AddSubjectForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const SubjectPageStyled = styled.div`
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
    background-color: #f2f2f2;
  }
  tbody tr:nth-child(odd) {
    background-color: #ffffff;
  }
`;

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);

  // Các trường trong form thêm môn học
  const [form] = Form.useForm();

  useEffect(() => {
    API.get('/subjects/all').then(res => {
      if (res.data.value) {
        setSubjects(res.data.value)
      } else {
        toastr.error('Có lỗi trong quá trình xử lý')
      }
    }).catch(e => {
      console.error(e)
      toastr.error('Có lỗi trong quá trình xử lý')
    })
  }, [])

  // Xử lý submit form thêm môn học
  const handleAddSubject = (values) => {
    
    API.post('/subjects/create', values).then(res => {
      if (res.data.value) {
        const subject = res.data.value
        setSubjects([...subjects, subject]);
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

  const [editingSubject, setEditingSubject] = useState(null); // ID của môn học đang được chỉnh sửa

  // Hiển thị modal để sửa thông tin môn học
  const showEditModal = (id) => {
    const subjectToEdit = subjects.find((subject) => subject.subjectId === id);
    form.setFieldsValue({ title: subjectToEdit.title, description: subjectToEdit.description });
    setEditingSubject(id);
    setIsModalEdit(true);
  };

  // Xử lý submit form sửa thông tin môn học
  const handleEditSubject = (values) => {
    API.post('/subjects/edit', {...values, subjectId: editingSubject}).then(res => {
      if (res.data.value) {
        const updatedSubjects = subjects.map(s =>
          s.subjectId === editingSubject ? {...values, subjectId: editingSubject} : s
        );
        setSubjects(updatedSubjects);
        form.resetFields();
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error('Có lỗi trong quá trình xử lý')
    }).finally(() => {
      setIsModalEdit(false);
      setEditingSubject(null);
  })
  };


  const handleDeleteSubject = (id) => {
    API.post('/subjects/delete', {subjectId: id}).then(res => {
      if (res.data.value) {
        setSubjects(subjects.filter((subject) => subject.subjectId !== id));
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  };

  // Cấu hình bảng danh sách môn học
  const columns = [
    {
      title: 'ID',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: 80
    },
    {
      title: 'Môn học',
      dataIndex: 'title',
      key: 'title',
      width: 180
    },
    {
      title: "Mô tả môn học",
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record.subjectId)}>
            Sửa
          </Button>
          <Popconfirm 
            placement="left"
            title="Xóa môn học"
            description={`Bạn chắc chắn muốn xóa môn học ${record.title} ?`}
            okText="Xóa"
            cancelText="Không"
            onConfirm={() => handleDeleteSubject(record.subjectId)}
          >
            <Button danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <SubjectPageStyled>
      <div className="btn-add">
        <Button type="primary" onClick={() => setIsModalAdd(true)}>
          Thêm môn học
        </Button>
      </div>
      <StyledTable 
        dataSource={subjects}
        columns={columns} 
        bordered 
        pagination={{
          pageSize: 5,
        }} 
      />

      <Modal
        title={isModalAdd ? "Thêm môn học" : "Chỉnh sửa thông tin môn học"}
        open={isModalAdd || isModalEdit}
        onCancel={() => {isModalAdd && setIsModalAdd(false); isModalEdit && setIsModalEdit(false)}}
        onOk={form.submit}
      >
        <AddSubjectForm 
          form={form} 
          onFinish={(values) => {isModalAdd? handleAddSubject(values) : handleEditSubject(values) }}
        >
          <Form.Item
            label="Tên môn học"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả môn học"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
        </AddSubjectForm>
      </Modal>

    </SubjectPageStyled>
  );
};

export default SubjectPage;
