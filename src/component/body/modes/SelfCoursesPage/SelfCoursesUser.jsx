import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import API from '../../../../context/config'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Select, Card, Form, List, Modal, Space, Input, Tabs, Popconfirm, Badge, InputNumber, Tooltip, Row, Col, Typography, Statistic } from 'antd'
import { COURSE_STATUS, ROLE } from '../../../../context/enum'
import VerticalList from '../../../common/VerticalList'
import Youtube from 'react-youtube'
import { DeleteOutlined, FileAddOutlined } from '@ant-design/icons'
import Question from '../common/Question'
import QuestionReadOnly from '../common/QuestionReadOnly'
import Course from '../common/Course'
import { useRef } from 'react'
import QuestionForm from '../common/QuestionForm'
import Countdown from 'react-countdown';

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

export default function SelfCoursesUser() {

  const [selectedCourse, setSelectCourse] = useState(null)

  const [courses, setCourses] = useState([])

  const [curVideo, setCurVideo] = useState(null)
  const [curTest, setCurTest] = useState(null)
  const [activeKey, setActiveKey] = useState(null)

  const [questions, setQuestions] = useState([])

  const [isStartTest, setStartTest] = useState(false)

  const getSelfCourses = () => {
    API.post("/courses/self", {regisType: 0}).then(res => {
      if (res.data.value) {
        console.log(res);
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
    API.get(`/courses/get/${course.courseId}`).then(res => {
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

  useEffect(() => {
    if (curTest) {
      API.get(`/questions/list/${curTest.testId}`).then(res => {
        if (res.data.value) {
          setQuestions(res.data.value)
        } else {
          toastr.error(res.data.message)
        }
      })
    }
  }, [curTest])

  let start = 0
  const videoRef = useRef()

  const handlePlay = (event) => {
    start = event.target.getCurrentTime()
  }

  const handlePause = (event) => {
    let end = event.target.getCurrentTime()
    let seenTime = (end - start)/60
    API.post('/videos/seen', {videoId: curVideo.videoId, seenTime}).then(res => {
      start = 0
    })
  }

  const handleEnd = (event) => {
    let end = event.target.getCurrentTime()
    let seenTime = (end - start)/60
    API.post('/videos/seen', {videoId: curVideo.videoId, seenTime}).then(res => {
      start = 0
    })
  }

  const [testingForm] = Form.useForm()
  const handleSubmit = () => {
    testingForm.submit()
  }

  const countDownRef = useRef()
  const submit = (values) => {
    // const params = {
    //   testId: curTest.testId,
    //   time: 
    // }
    console.log(countDownRef.current)
    setStartTest(false)
  }

  return (
    <SelfCourseStyled>
      {selectedCourse && <Row className='edit-space'>
        <Col span={7} className='left'>
          <div className="content">
            <div style={{padding: '4px'}}>
              <Typography.Title level={5} >{selectedCourse.title}</Typography.Title>
              <Typography.Text>{selectedCourse.description}</Typography.Text>
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
              <Youtube 
                videoId={curVideo.URL} 
                onPlay={handlePlay}
                onPause={handlePause}
                onEnd={handleEnd}
                ref={videoRef}
              />
            </Space>}

            {curTest && <div>
              <div className="questions">
                <Space>
                  {!isStartTest && <Button type='primary' onClick={() => setStartTest(true)}>Bắt đầu</Button>}
                  {isStartTest && <Countdown ref={countDownRef} date={curTest.estimate*60*1000 + Date.now()} onComplete={handleSubmit} />}
                  {isStartTest && <Button type='primary' onClick={handleSubmit}>Nộp bài</Button>}
                </Space>
                {isStartTest && <Form
                  onFinish={submit}
                  form={testingForm}
                >
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
                      <QuestionForm params={item} />
                    )}
                  />
                </Form>}
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

