import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, List, Popconfirm } from 'antd'
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

export default function CoursesAdmin() {
  const { user } = useContext(UserContext)

  const [courses, setCourses] = useState([])

  const getAllWaitCourse = () => {
    API.post('approve/wait').then(res => {
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
    if (user) {
      getAllWaitCourse()
    }
  }, [])

  const handleAddForApprove = (courseId) => {
    if (courseId) {
      API.post(`approve/add`, {courseId}).then(res => {
        if (res.data.value) {
          toastr.success(res.data.message)
        } else {
          toastr.error(res.data.message)
        }
        getAllWaitCourse()
      }).catch(e => {
        console.error(e)
        toastr.error("Có lỗi trong quá trình xử lý")
      })
    }
  }

  return (
    <CoursePageStyled>
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
              <Card 
                size='small' 
                hoverable 
                title={item.title}
              >
                {item.description || 'Không có mô tả'}
                <Popconfirm
                  okText="Thêm"
                  cancelText="Không"
                  onConfirm={() => handleAddForApprove(item.courseId)}
                  title="Thêm vào danh sách duyệt"
                >
                  <Button block type='primary' size='small'>Thêm</Button>
                </Popconfirm>
              </Card>
            </List.Item>
          )}
        />
      </div>

    </CoursePageStyled>
  )
}

