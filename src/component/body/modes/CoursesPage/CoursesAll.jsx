import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Select, Card, Form, List, Modal, Space, Input, Tabs, Popconfirm, Badge, InputNumber, Tooltip, Row, Col, Typography } from 'antd'
import { COURSE_STATUS, ROLE } from '../../../../context/enum'
import API from '../../../../context/config'

const CoursePageStyled = styled.div`
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

export default function CoursesAll() {
  const [courses, setCourses] = useState([])
  const [suggests, setSuggests] = useState([])

  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      API.post("learn/suggest").then(res => {
        if (res.data.value) {
          setSuggests(res.data.value)
        }
      })
    }
  }, [])

  const getAllPublishCourse = () => {
    API.post('common/courses').then(res => {
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
    getAllPublishCourse()
  }, [])

  const handleRegisCourse = (courseId) => {
    if (courseId) {
      API.post(`learn/courses/regis`, {courseId}).then(res => {
        if (res.data.value) {
          toastr.success(res.data.message)
        } else {
          toastr.error(res.data.message)
        }
        getAllPublishCourse()
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }

  return (
    <CoursePageStyled>
      {suggests.length > 0 && <div className='suggest'>
        <Typography.Title level={3}>Gợi ý</Typography.Title>
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
          dataSource={suggests}
          renderItem={(item) => (
            <List.Item title={item.title}>
              <Card 
                size='small' 
                hoverable 
                title={item.title}
              >
                {item.description || 'Không có mô tả'}
                <br />
                <Typography.Text type="secondary">Môn học: {item.subject.title}</Typography.Text>
                <Popconfirm
                  okText="Xác nhận"
                  cancelText="Không"
                  onConfirm={() => handleRegisCourse(item.courseId)}
                  title="Đăng ký khóa học"
                  description="Bạn sẽ đăng ký khóa học này ?"
                >
                  <Button block type='primary' size='small'>Đăng ký</Button>
                </Popconfirm>
              </Card>
            </List.Item>
          )}
        />
      </div>}
      <div className="courses">
      <Typography.Title level={3}>Tất cả</Typography.Title>
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
              <Card 
                size='small' 
                hoverable 
                title={item.title}
              >
                {item.description || 'Không có mô tả'}
                <br />
                <Typography.Text type="secondary">Môn học: {item.subject.title}</Typography.Text>
                <Popconfirm
                  okText="Xác nhận"
                  cancelText="Không"
                  onConfirm={() => handleRegisCourse(item.courseId)}
                  title="Đăng ký khóa học"
                  description="Bạn sẽ đăng ký khóa học này ?"
                >
                  <Button block type='primary' size='small'>Đăng ký</Button>
                </Popconfirm>
              </Card>
            </List.Item>
          )}
        />
      </div>

    </CoursePageStyled>
  )
}

