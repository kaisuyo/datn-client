import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import API from '../../../../context/config'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Select, Card, Form, List, Modal, Space, Input, Tabs, Popconfirm, Badge, InputNumber, Tooltip, Row, Col } from 'antd'
import { COURSE_STATUS, ROLE } from '../../../../context/enum'
import VerticalList from '../../../common/VerticalList'
import Youtube from 'react-youtube'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import Question from '../common/Question'
import Course from '../common/Course'

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
      height: 100%;
      padding: 0 4px 0 0;
    }
    
    .right {
      height: 100%;
      padding: 0 0 0 4px;

      .questions {
        height: 490px;
        overflow: scroll;
        padding: 4px;
      }
    }
  }

  .courses {
    padding-top: 8px;
  }

  .ant-form-item-control-input-content {
    width: min-content;
  }

`

export default function SelfCoursesProvider() {
  const { user } = useContext(UserContext)

  const [selectedId, setSelectId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [title, setTitle] = useState("Tiêu đề")
  const [description, setDescription] = useState("Mô tả")
  const [tests, setTests] = useState([])
  const [videos, setVideos] = useState([])

  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])

  const [isOpenModal, setOpenModal] = useState(false)
  const [curVideo, setCurVideo] = useState(null)
  const [curTest, setCurTest] = useState(null)
  const [activeKey, setActiveKey] = useState(null)

  const [isShowModalT, setShowModalT] = useState(false)
  const [isShowModalV, setShowModalV] = useState(false)
  
  const [questions, setQuestions] = useState([])
  const [isShowModalAddQ, setShowModalAddQ] = useState(false)

  const [formT] = Form.useForm()
  const [formV] = Form.useForm()

  useEffect(() => {
    API.post("/provide/courses/self").then(res => {
      if (res.data.value) {
        setCourses(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })

    API.post('/common/subjects').then(res => {
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
      API.post(`provide/courses/get`, {courseId: selectedId}).then(res => {
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
      }).finally(() => {
        setCurTest(null)
        setCurVideo(null)
      })
    }

    API.post("provide/courses/self").then(res => {
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
    API.post("provide/courses/create", values).then(res => {
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
    API.post("provide/courses/update", {...values, courseId: selectedId}).then(res => {
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

  const handleChangeSelected = (key, type) => {
    setActiveKey(key)
    if (type === 'video') {
      API.post(`provide/videos/get`, {videoId: key}).then(res => {
        setCurVideo(res.data.value)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    } else if (type === 'test') {
      API.post(`provide/tests/get`, {testId: key}).then(res => {
        setCurTest(res.data.value)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }

  const handleDeleteCourse = () => {
    API.post(`provide/courses/delete`, {courseId: selectedId}).then(res => {
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

  const handleCreateVideo = (values) => {
    API.post('provide/videos/create', {...values, courseId: selectedId}).then(res => {
      if (res.data.value) {
        const newVideo = {...res.data.value, key: res.data.value.videoId}
        setVideos([newVideo, ...videos])
        setCurVideo(newVideo)
        setActiveKey(res.data.value.videoId)
        toastr.success("Tạo bài giảng thành công")
      } else {
        toastr.error(res.data.message)
      }
    }).finally(() => {
      setShowModalV(false)
    })
  }

  const handleCreateTest = (values) => {
    API.post('provide/tests/create', {...values, courseId: selectedId}).then(res => {
      if (res.data.value) {
        const newTest = {...res.data.value, key: res.data.value.testId}
        setCurTest(newTest)
        setTests([newTest, ...tests])
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
    API.post('provide/courses/send', {courseId: selectedId}).then(res => {
      if (res.data.value) {
        setSelectedStatus(COURSE_STATUS.WAIT)
        toastr.success("Đã gửi khóa học tới danh sách chờ kiểm duyệt")
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const changeVideoInfo = (values) => {
    API.post(`provide/videos/update`, {...values, videoId: curVideo.videoId}).then(res => {
      if (res.data.value) {
        setCurVideo({...curVideo, URL: values.url})

      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const deleteVideo = () => {
    API.post(`provide/videos/delete`, {videoId: curVideo.videoId}).then(res => {
      if (res.data.value) {
        setVideos(videos.filter(v => v.videoId !== curVideo.videoId))
        setCurVideo(null)
        setCurTest(null)
        setActiveKey(null)
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  useEffect(() => {
    if (curTest) {
      API.post(`provide/questions/list`, {testId: curTest.testId}).then(res => {
        if (res.data.value) {
          setQuestions(res.data.value)
        } else {
          setQuestions([])
          toastr.error(res.data.message)
        }
      }).finally(() => {
        formAddQ.resetFields()
        formT.resetFields()
      })
    }

  }, [curTest])

  const [formAddQ] = Form.useForm()

  const changeTestInfo = (values) => {
    API.post('provide/tests/update', {testId: curTest.testId, ...values}).then(res => {
      if (res.data.value) {
        toastr.success("Cập nhật thông tin bài kiểm tra thành công")
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const addQuestion = (values) => {
    API.post('provide/questions/add', {testId: curTest.testId, ...values}).then(res => {
      if (res.data.value) {
        toastr.success("Tạo câu hỏi thành công")
        setQuestions(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const deleteTest = (testId) => {
    API.post(`provide/tests/delete`, {testId}).then(res => {
      if (res.data.value) {
        setTests(tests.filter(t => t.testId !== testId))
        setCurVideo(null)
        setCurTest(null)
        setActiveKey(null)
        toastr.success("Xóa bài kiểm tra thành công")
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const saveQuestion = (values) => {
    API.post('provide/questions/update', {questionId: curTest.testId, ...values}).then(res => {
      if (res.data.value) {
        toastr.success("Lưu câu hỏi thành công")
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const deleteQuestion = (questionId) => {
    API.post(`provide/questions/delete`, {questionId}).then(res => {
      if (res.data.value) {
        toastr.success("Xóa câu hỏi thành công")
        setQuestions(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    })
  }

  const handleVideoReady = (event) => {
    API.post('provide/videos/updateTime', {videoId: curVideo.videoId, time: event.target.getDuration()/60})
  }

  return (
    <SelfCourseStyled>
      {!selectedId && user.role === ROLE.PROVIDER && <Space>
        <Button type="primary" onClick={() => setOpenModal(true)}>Tạo khóa học</Button>
      </Space>}

      {selectedId && <Row className='edit-space'>
        <Col span={7} className='left'>
          <div className="content">
            {user.role === ROLE.PROVIDER && <div style={{padding: '4px'}}>
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
                      <Button disabled={selectedStatus !== COURSE_STATUS.N0} danger size="small">Xóa khóa học</Button>
                    </Popconfirm>
                    <Button onClick={() => setSelectId(null)}>Đóng</Button>
                  </Space>
                </Form.Item>
              </Form>
              <Tabs 
                onChange={() => {
                  setActiveKey(null);
                  setCurTest(null);
                  setCurVideo(null);
                }} defaultActiveKey="1" 
                items={[
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
        </Col>
        <Col  span={17} className='right'>
          <div className="content">
            {curVideo && <Space direction='vertical'>
              <Youtube 
                videoId={curVideo.URL} 
                onReady={handleVideoReady}  
              />
              <Form
                onFinish={changeVideoInfo}
                disabled={selectedStatus !== COURSE_STATUS.N0}
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

            {curTest && <div>
              <Form
                onFinish={changeTestInfo}
                initialValues={{
                  estimate: curTest.estimate,
                  title: curTest.title,
                  description: curTest.description
                }}
                disabled={selectedStatus !== COURSE_STATUS.N0}
              >
                <Space>
                  <Form.Item
                    name="estimate"
                    rules={[{ required: true, message: 'Nhập thời gian làm bài!' }]}
                  >
                    <InputNumber min={5} placeholder='Thời gian' />
                  </Form.Item>
                  <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'Nhập tiêu đề bài kiểm tra!' }]}
                    style={{width: '200px'}}
                  >
                    <Input placeholder='Tiều đề'/>
                  </Form.Item>
                  <Form.Item
                    style={{width: '300px'}}
                    name="description"
                  >
                    <Input.TextArea placeholder='Mô tả bài kiểm tra' />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType='submit' type='primary'>Lưu thông tin</Button>
                  </Form.Item>
                  <Form.Item>
                    <Tooltip title="Thêm câu hỏi" placement='bottom'>
                      <Button onClick={() => setShowModalAddQ(true)}><FileAddOutlined /></Button>
                    </Tooltip>
                  </Form.Item>
                  <Form.Item>
                    <Popconfirm
                      title={'Xóa bài kiểm tra'}
                      onConfirm={() => deleteTest(curTest.testId)}
                      okText="Xóa"
                      cancelText="Không xóa"
                      description="Bạn thực sự muốn xóa bài kiểm tra này ?"
                    >
                      <Tooltip title="Xóa bài kiểm tra này" placement='bottom'>
                        <Button danger><DeleteOutlined /></Button>
                      </Tooltip>
                    </Popconfirm>
                  </Form.Item>
                </Space>
              </Form>
              <div className="questions">
                <List 
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
                  }}
                  dataSource={questions}
                  renderItem={(item) => (
                    <Question params={item} status={selectedStatus} saveQuestion={saveQuestion} deleteQuestion={deleteQuestion} />
                  )}
                />
              </div>
            </div>}
          </div>
        </Col>
      </Row>}
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
              <Course item={item} />
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
        </Form>
      </Modal>

      <Modal
        open={isShowModalAddQ}
        onCancel={() => setShowModalAddQ(false)}
        title="Thêm câu hỏi cho bài kiểm tra"
        onOk={() => {formAddQ.submit()}}
      >
        <Form
          form={formAddQ}
          onFinish={(values) => {
            setShowModalAddQ(false)
            addQuestion(values)
          }}
        >
          <Form.Item
            rules={[{ required: true, message: 'Bạn chưa nhập câu hỏi!' }]}
            label="Câu hỏi"
            name="description"
          >
            <Input.TextArea placeholder='Nhập câu hỏi'/>
          </Form.Item>
          <Form.Item
            label="Đáp án A"
            name="optionA"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đáp án B"
            name="optionB"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đáp án C"
            name="optionC"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đáp án D"
            name="optionD"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={`answer`}
            label="Đáp án đúng"
            rules={[{ required: true, message: 'Câu hỏi phải có đáp án đúng!' }]}
          >
            <Select 
              options={[
                {
                  value: 'A',
                  label: 'A',
                },
                {
                  value: 'B',
                  label: 'B',
                },
                {
                  value: 'C',
                  label: 'C',
                },
                {
                  value: 'D',
                  label: 'D',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </SelfCourseStyled>
  )
}

