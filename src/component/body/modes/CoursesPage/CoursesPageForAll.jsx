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

export default function CoursesPageForAll() {
  const { user } = useContext(UserContext)

  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    let apiLink = '/courses/'
    if (user) {
      switch(user.role) {
        case ROLE.USER: 
        case ROLE.SUPER_USER: {
          apiLink += 'public'
          break;
        }
        case ROLE.ADMIN: {
          apiLink += 'wait'
          break
        }
        case ROLE.SYSTEM_USER: {
          apiLink += 'public'
          break;
        }
        default: {}
      }
    } else {
      apiLink += 'public'
    }
    API.get(apiLink).then(res => {
      if (res.data.value) {
        setCourses(res.data.value)
      } else {
        toastr.error(res.data.message)
      }
    }).catch(e => {
      console.error(e)
      toastr.error("Đã có lỗi hệ thống")
    })
  }, [])

  const handleSelectCourse = (courseId) => {
    if (courseId) {
      API.get(`/courses/get/${courseId}`).then(res => {
        if (res.data.value) {
          const info = res.data.value
          setSelectedCourse(info)
        } else {
          toastr.error(res.data.message)
        }
        window.scrollTo(0, 0)
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }

  return (
    <CoursePageStyled>
      {selectedCourse && <Row className='info-space'>
        
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
            <List.Item onClick={() => handleSelectCourse(item.courseId)}>
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

    </CoursePageStyled>
  )
}

