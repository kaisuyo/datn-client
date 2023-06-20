import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../context/AppContext'
import API from '../../../context/config'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Select, Card, Form, List, Modal, Space, Input, Tabs, Popconfirm, Badge, InputNumber } from 'antd'
import { COURSE_STATUS, ROLE } from '../../../context/enum'
import VerticalList from '../../common/VerticalList'
import Youtube from 'react-youtube'

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
        height: 310px;
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

  .courses {
    padding-top: 8px;
  }
`

export default function SelfCourses() {
  const { user } = useContext(UserContext)

  const [selectedId, setSelectId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
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

  const [courseForm] = Form.useForm()
  const handleSelectCourse = (course) => {
    setSelectId(course.courseId)
  }

  useEffect(() => {
    if (selectedId) {
      API.get(`/courses/get/${selectedId}`).then(res => {
        if (res.data.value) {
          const { title, description, status, videos, tests } = res.data.value
          setTitle(title)
          setDescription(description)
          setSelectedStatus(status)
          setVideos(videos.map(v => ({...v, key: v.videoId})))
          setTests(tests.map(t => ({...t, key: t.testId})))
        } else {
          toastr.error(res.data.message)
        }
        window.scrollTo(0, 0)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }

    API.post("/courses/self", {regisType: user.role === ROLE.USER ? 0:1}).then(res => {
      if (res.data.value) {
        setCourses(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    })
  }, [selectedId])

  useEffect(() => {
    courseForm.resetFields()
  }, [title, description])

  const handleCreateCourse = (values) => {
    API.post("/courses/create", values).then(res => {
      if (res.data.value) {
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
        setSelectId(res.data.value)
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
  const [curVideo, setCurVideo] = useState(null)
  const [curTest, setCurTest] = useState(null)

  const [activeKey, setActiveKey] = useState(null)
  const handleChangeSelected = (key, type) => {
    setActiveKey(key)
    if (type === 'video') {
      API.get(`videos/${key}`).then(res => {
        setCurVideo(res.data.value)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    } else if (type === 'test') {
      API.get(`tests/${key}`).then(res => {
        setCurTest(res.data.value)
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
        setCourses(courses.filter(c => c.courseId !== selectedId))
        setSelectId(null)
        toastr.success("Xóa khóa học thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })
  }

  const [isShowModalT, setShowModalT] = useState(false)
  const [isShowModalV, setShowModalV] = useState(false)
  const [formT] = Form.useForm()
  const [formV] = Form.useForm()

  const handleCreateVideo = (values) => {
    API.post('/videos/create', {...values, courseId: selectedId}).then(res => {
      if (res.data.value) {
        setVideos([...videos, res.data.value])
        setActiveKey(res.data.videoId)
        toastr.success("Tạo bài giảng thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).finally(() => {
      setShowModalV(false)
    })
  }

  const handleCreateTest = (values) => {
    API.post('/tests/create', {...values, courseId: selectedId}).then(res => {
      if (res.data.value) {
        setTests([...tests, res.data.value])
        setActiveKey(res.data.testId)
        toastr.success("Tạo bài kiểm tra thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).finally(() => {
      setShowModalT(false)
    })
  }

  const sendCourse = () => {
    API.post('/courses/send', {courseId: selectedId}).then(res => {
      if (res.data.value) {
        setSelectedStatus(COURSE_STATUS.WAIT)
        toastr.success("Tạo bài kiểm tra thành công")
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const changeVideoInfo = (values) => {
    API.post(`/videos/update`, {...values, videoId: curVideo.videoId}).then(res => {
      if (res.data.value) {
        setCurVideo({...curVideo, URL: values.url})

      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const deleteVideo = () => {
    API.get(`/videos/delete/${curVideo.videoId}`).then(res => {
      if (res.data.value) {
        setVideos(videos.filter(v => v.videoId !== curVideo.videoId))
        setCurVideo(null)
        setActiveKey(null)
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  return (
    <SelfCourseStyled>
      {!selectedId && <Space>
        <Button type="primary" onClick={() => setOpenModal(true)}>Tạo khóa học</Button>
      </Space>}

      {selectedId && <div className='edit-space'>
        <div className="left">
          <div className="content">
            {user.role === ROLE.SUPER_USER && <div style={{padding: '4px'}}>
              <Form
                size='small'
                onFinish={handleUpdateCourse}
                form={courseForm}
                initialValues={{
                  title,
                  description
                }}
              >
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề khóa học!' }]}
                >
                  <Input disabled={selectedStatus !== COURSE_STATUS.N0} placeholder='Tiêu đề khóa học'/>
                </Form.Item>
                <Form.Item
                  name="description"
                >
                  <Input.TextArea disabled={selectedStatus !== COURSE_STATUS.N0} style={{resize: 'none'}} placeholder='Mô tả khóa học' />
                </Form.Item>
                <Form.Item style={{textAlign: 'right'}}>
                  <Space >
                    <Badge
                      color={
                        selectedStatus === COURSE_STATUS.WAIT ? "magenta" :
                        (selectedStatus === COURSE_STATUS.BLOCK ? "red" : 
                        (selectedStatus === COURSE_STATUS.N0 ? "purple":"green"))
                      }
                      text={
                        selectedStatus === COURSE_STATUS.WAIT ? "Chờ duyệt" :
                        (selectedStatus === COURSE_STATUS.BLOCK ? "Từ chối" : 
                        (selectedStatus === COURSE_STATUS.N0 ? "Chỉnh sửa":"Đã duyệt"))
                      } 
                    />
                    <Popconfirm 
                      placement="right"
                      title='Xác nhận hoàn thành tạo khóa học'
                      description='Khi đồng ý, bạn sẽ không thể sửa được khóa học này nữa'
                      onConfirm={sendCourse}
                      okText="Đồng ý"
                      cancelText="Chưa"
                    >
                      <Button disabled={selectedStatus !== COURSE_STATUS.N0}>Gửi</Button>
                    </Popconfirm>
                    <Button disabled={selectedStatus !== COURSE_STATUS.N0} type="primary" size='small' htmlType='submit'>Lưu</Button>
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
                    <Button onClick={() => setSelectId(null)}>Đóng</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Tabs defaultActiveKey="1" items={[
                {
                  key: "1", 
                  label: "Bài giảng", 
                  children: (<>
                    <Button disabled={selectedStatus !== COURSE_STATUS.N0} size='small' onClick={() => setShowModalV(true)}>Thêm bài giảng</Button>
                    <div className='list-item'>
                      <VerticalList list={videos} handleChangeSelected={handleChangeSelected} activeKey={activeKey} type={'video'}/>
                    </div>
                  </>)
                },
                {
                  key: "2", 
                  label: "Kiểm tra", 
                  children: (<>
                    <Button disabled={selectedStatus !== COURSE_STATUS.N0} size='small' onClick={() => {setShowModalT(true)}}>Thêm bài kiểm tra</Button>
                    <div className='list-item'>
                      <VerticalList list={tests} handleChangeSelected={handleChangeSelected} activeKey={activeKey} type={'test'}/>
                    </div>
                  </>)
                }
              ]} />
            </div>}
          </div>
        </div>
        <div className="right">
          <div className="content">
            {curVideo && <Space direction='vertical'>
              <Youtube videoId={curVideo.URL} />
              <Form
                onFinish={changeVideoInfo}
              >
                <Space>
                  <Form.Item
                    label="Thay đổi URL video"
                    name="url"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType='submit' type='primary'>Thay đổi</Button>
                  </Form.Item>
                  <Form.Item>
                  <Popconfirm
                      placement="right"
                      title="Xóa bài giảng"
                      description="Bạn thực sự muốn xóa bài giảng này ?"
                      onConfirm={deleteVideo}
                      cancelText="Không"
                      okText="Xóa"
                    >
                      <Button danger>Xóa bài giảng</Button>
                    </Popconfirm>
                  </Form.Item>
                </Space>
              </Form>
            </Space>}
          </div>
        </div>
      </div>}
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
            <List.Item onClick={() => handleSelectCourse(item)}>
              <Badge.Ribbon 
                text={
                  item.status === COURSE_STATUS.WAIT ? "Chờ duyệt" :
                  (item.status === COURSE_STATUS.BLOCK ? "Từ chối" : 
                  (item.status === COURSE_STATUS.N0 ? "Chỉnh sửa":"Đã duyệt"))
                } 
                color={
                  item.status === COURSE_STATUS.WAIT ? "magenta" :
                  (item.status === COURSE_STATUS.BLOCK ? "red" : 
                  (item.status === COURSE_STATUS.N0 ? "purple":"green"))
                }
              >
                <Card size='small' hoverable title={item.title}>
                  {item.description || 'Không có mô tả'}
                </Card>
              </Badge.Ribbon>
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

      <Modal
        open={isShowModalT}
        title="Thêm bài kiểm tra"
        onOk={() => formT.submit()}
        onCancel={() => setShowModalT(false)}
      >
        <Form form={formT} onFinish={(values) => {handleCreateTest(values)}}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Nhập tiêu đề bài kiểm tra' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả bài kiểm tra"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Thời gian"
            name="estimate"
            rules={[{ required: true, message: 'Hãy nhập thời gian làm bài' }]}
          >
            <InputNumber size="small" min={5} max={180} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isShowModalV}
        title="Thêm bài giảng"
        onOk={() => formV.submit()}
        onCancel={() => setShowModalV(false)}
      >
        <Form form={formV} onFinish={(values) => {handleCreateVideo(values)}}>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Nhập tiêu đề bài giảng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả bài giảng"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="URL video"
            name="url"
            rules={[{ required: true, message: 'Hãy nhập id của video (Youtube)' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thời lượng"
            name="time"
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </SelfCourseStyled>
  )
}

