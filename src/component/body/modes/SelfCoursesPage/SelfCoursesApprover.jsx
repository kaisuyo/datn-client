import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import API from '../../../../context/config'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Select, Card, Form, List, Modal, Space, Input, Tabs, Popconfirm, Badge, InputNumber, Tooltip, Row, Col, Typography } from 'antd'
import { COURSE_STATUS, ROLE } from '../../../../context/enum'
import VerticalList from '../../../common/VerticalList'
import Youtube from 'react-youtube'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import Question from '../common/Question'
import QuestionReadOnly from '../common/QuestionReadOnly'
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

export default function SelfCoursesApprover() {
  const { user } = useContext(UserContext)

  const [selectedCourse, setSelectCourse] = useState(null)

  const [courses, setCourses] = useState([])

  const [curVideo, setCurVideo] = useState(null)
  const [curTest, setCurTest] = useState(null)
  const [activeKey, setActiveKey] = useState(null)

  const [questions, setQuestions] = useState([])

  const getSelfCourses = () => {
    API.post("/approve/self").then(res => {
      if (res.data.value) {
        setCourses(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })
  }

  useEffect(() => {
    getSelfCourses()
  }, [])

  const handleSelectCourse = (course) => {
    API.post(`approve/get`, {courseId: course.courseId}).then(res => {
      if (res.data.value) {
        const data = res.data.value
        const tests = data.tests.map(t => ({...t, key: t.testId}))
        const videos = data.videos.map(v => ({...v, key: v.videoId}))
        setSelectCourse({...data, ...{videos}, ...{tests}})
      } else {
        toastr.error(res.data.message)
      }
      window.scrollTo(0, 0)
    }).catch(e => {
      console.error(e)
      toastr.error("Có lỗi trong quá trình xử lý")
    })
  }

  const handleChangeSelected = (key, type) => {
    setActiveKey(key)
    if (type === 'video') {
      API.post(`approve/videos`, {videoId: key}).then(res => {
        setCurVideo(res.data.value)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    } else if (type === 'test') {
      API.post(`approve/tests`, {testId: key}).then(res => {
        setCurTest(res.data.value)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }

  const handleApprove = (values) => {
    API.post('/approve/', {...values, courseId: selectedCourse.courseId}).then(res => {
      if (res.data.value) {
        toastr.success("Cập nhật thành công trạng thái khóa học")
        setSelectCourse(null)
        setActiveKey(null)
        setCurTest(null)
        setCurVideo(null)
      } else {
        toastr.error(res.data.message)
      }
      getSelfCourses()
    })
  }

  useEffect(() => {
    if (curTest) {
      API.post(`approve/questions`, {testId: curTest.testId}).then(res => {
        if (res.data.value) {
          setQuestions(res.data.value)
        } else {
          toastr.error(res.data.message)
        }
      })
    }
  }, [curTest])

  return (
    <SelfCourseStyled>
      {selectedCourse && <Row className='edit-space'>
        <Col span={7} className='left'>
          <div className="content">
            <div style={{padding: '4px'}}>
              <Typography.Title level={5} >{selectedCourse.title}</Typography.Title>
              <Typography.Text>{selectedCourse.description}</Typography.Text>
              <Form
                initialValues={{
                  description: '',
                  status: selectedCourse.status,
                }}
                onFinish={handleApprove}
              >
                <Row>
                  <Col span={16} style={{padding: 4}}>
                    <Form.Item
                      name='description'
                    >
                      <Input.TextArea placeholder='Ghi chú cho người đăng khóa học' />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{padding: 4}}>
                    <Form.Item
                      name="status"
                      rules={[{ required: true, message: 'Chọn trạng thái' }]}
                    >
                      <Select
                        size='small'
                        options={[
                          {label: "Trả lại", value: COURSE_STATUS.N0},
                          {label: "Đang duyệt", value: COURSE_STATUS.WAIT},
                          {label: "Duyệt", value: COURSE_STATUS.ALOW}
                        ]}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button size='small' htmlType='submit' type='primary' block>Lưu</Button>
                    </Form.Item>
                  </Col>
                </Row>
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
                    <div className='list-item'>
                      <VerticalList list={selectedCourse?.videos} handleChangeSelected={handleChangeSelected} activeKey={activeKey} type={'video'}/>
                    </div>
                  </>)
                },
                {
                  key: "2", 
                  label: "Kiểm tra", 
                  children: (<>
                    <div className='list-item'>
                      <VerticalList list={selectedCourse?.tests} handleChangeSelected={handleChangeSelected} activeKey={activeKey} type={'test'}/>
                    </div>
                  </>)
                }
              ]} />
            </div>
          </div>
        </Col>
        <Col span={17} className='right'>
          <div className="content">
            {curVideo && <Space direction='vertical'>
              <Youtube videoId={curVideo.URL} />
            </Space>}

            {curTest && <div>
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
                    <QuestionReadOnly params={item} />
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
    </SelfCourseStyled>
  )
}

