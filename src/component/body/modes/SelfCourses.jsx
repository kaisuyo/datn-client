import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../context/AppContext'
import API from '../../../context/config'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Select, Card, Form, List, Modal, Space, Input, Tabs, Popconfirm } from 'antd'
import { ROLE } from '../../../context/enum'
import VerticalList from '../../common/VerticalList'


const SelfCourseStyled = styled.div`
  padding: 8px 16px;
  text-align: center;

  .edit-space {
    width: 100%;
    height: 580px;
    display: flex;

    .content {
      border: 1px solid rgba(0, 0, 0, 0.3);
      width: 100%;
      height: 100%;
      padding: 4px;

      .list-item {
        width: 100%;
        height: 330px;
        overflow: scroll;
      }
    }

    .left {
      width: 420px;
      height: 100%;
      padding: 0 4px 0 0;
    }
    
    .right {
      flex-grow: 1;
      height: 100%;
      padding: 0 0 0 4px;
    }
  }
`

export default function SelfCourses() {
  const { user } = useContext(UserContext)

  const [selectedId, setSelectId] = useState(0)
  const [title, setTitle] = useState("Tiêu đề")
  const [description, setDescription] = useState("Mô tả")
  const [tests, setTests] = useState([])
  const [videos, setVideos] = useState([])

  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    API.post("/courses/self", {regisType: user.role === ROLE.USER ? 0:1}).then(res => {
      if (res.data.value) {
        setCourses(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })

    API.get('subjects/all').then(res => {
      if (res.data.value) {
        setSubjects(res.data.value.map(s => ({label: s.title, value: s.subjectId})))
      }
    })
  }, [])

  useEffect(() => {
    if (selectedId) {
      API.get(`/courses/get/${selectedId}`).then(res => {
        if (res.data.value) {
          const { videos, tests } = res.data.value
          setVideos(videos.map(v => ({...v, key: v.videoId})))
          setTests(tests.map(t => ({...t, key: t.testId})))
        } else {
          toastr.error(res.data.message)
        }
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }, [selectedId])

  const handleCreateCourse = (values) => {
    API.post("/courses/create", values).then(res => {
      if (res.data.value) {
        setTitle(res.data.value.title)
        setDescription(res.data.value.description)
        setSelectId(res.data.value.courseId)
        setOpenModal(false)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })
  }

  const handleUpdateCourse = (values) => {
    API.post("/courses/update", {...values, courseId: selectedId}).then(res => {
      if (res.data.value) {
        toastr.success(res.data.message)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })
  }

  const [form] = Form.useForm()
  const handleOk = () => {
    form.submit()
  };

  const [isOpenModal, setOpenModal] = useState(false)

  const [activeKey, setActiveKey] = useState(null)
  const handleChangeSelected = (key, type) => {
    setActiveKey(key)
    if (type === 'video') {
      API.get(`videos/${key}`).then(res => {
        console.log(res.data);
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    } else if (type === 'test') {
      API.get(`tests/${key}`).then(res => {
        console.log(res.data);
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }

  const handleDeleteCourse = () => {
    API.get(`/courses/delete/${selectedId}`).then(res => {
      if (res.data.value) {
        setTests([])
        setVideos([])
        setActiveKey(null)
        setDescription("")
        setTitle("")
        setSelectId(0)
        toastr.success("Xóa khóa học thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })
  }

  return (
    <SelfCourseStyled>
      {!selectedId && <Space>
        <Button type="primary" onClick={() => setOpenModal(true)}>Tạo khóa học</Button>
      </Space>}

      {selectedId !== 0 && <div className='edit-space'>
        <div className="left">
          <div className="content">
            {user.role === ROLE.SUPER_USER && <div style={{padding: '4px'}}>
              <Form
                size='small'
                initialValues={{
                  title,
                  description,
                }}
                onFinish={handleUpdateCourse}
              >
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề khóa học!' }]}
                >
                  <Input placeholder='Tiêu đề khóa học'/>
                </Form.Item>
                <Form.Item
                  name="description"
                >
                  <Input.TextArea style={{resize: 'none'}} placeholder='Mô tả khóa học' />
                </Form.Item>
                <Form.Item style={{textAlign: 'right'}}>
                  <Space >
                    <Button type="primary" size='small' htmlType='submit'>Lưu</Button>
                    <Popconfirm
                      placement="right"
                      title="Xóa khóa học"
                      description="Bạn thực sự muốn xóa khóa học này ?"
                      onConfirm={handleDeleteCourse}
                      cancelText="Không"
                      okText="Xóa"
                    >
                      <Button danger size="small">Xóa khóa học</Button>
                    </Popconfirm>
                  </Space>
                </Form.Item>
              </Form>
              <Tabs defaultActiveKey="1" items={[
                {
                  key: "1", 
                  label: "Bài giảng", 
                  children: (<div className='list-item'>
                    <VerticalList list={videos} handleChangeSelected={handleChangeSelected} activeKey={activeKey} type={'video'}/>
                  </div>)
                },
                {
                  key: "2", 
                  label: "Kiểm tra", 
                  children: (<div className='list-item'>
                    <VerticalList list={tests} handleChangeSelected={handleChangeSelected} activeKey={activeKey} type={'test'}/>
                  </div>)
                }
              ]} />
            </div>}
          </div>
        </div>
        <div className="right">
          <div className="content">

          </div>
        </div>
      </div>}
      <br />
      <div className="courses">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={courses}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.title}>{item.description}</Card>
            </List.Item>
          )}
        />
      </div>

      <Modal 
        open={isOpenModal}
        title="Tạo khóa học"
        onOk={handleOk}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} onFinish={(values) => {handleCreateCourse(values)}}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Nhập tiêu đề khóa học' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Về môn học"
            name="subjectId"
            rules={[{ required: true, message: 'Hãy chọn một môn học' }]}
          >
            <Select options={subjects} />
          </Form.Item>
        </Form>
      </Modal>
    </SelfCourseStyled>
  )
}

