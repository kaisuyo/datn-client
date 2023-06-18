import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../context/AppContext'
import API from '../../../context/config'
import toastr from 'toastr'
import { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, List, Space, Tabs } from 'antd'

const SelfCourseStyled = styled.div`
  padding: 8px 16px;
  text-align: center;
`

export default function SelfCourses() {
  const { user } = useContext(UserContext)

  const items = [
    {
      label: `Bài giảng`,
      key: 1,
      children: (<></>),
    },
    {
      label: `Bài kiểm tra`,
      key: 2,
      children: (<></>),
    },
  ]

  const [selectedId, setSelectId] = useState(null)

  const [courses, setCourses] = useState([])

  useEffect(() => {
    API.post("/courses/self").then(res => {
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

  const handleCreateCourse = (values) => {
    API.post("/courses/create", values).then(res => {
      if (res.data.value) {
        setSelectId(res.data.value)
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
      <Space>
        <Button type="primary" onClick={() => setSelectId(0)}>Tạo khóa học</Button>
      </Space>
      {selectedId != null && <div className="course-selected">
        <Tabs tabPosition='left' items={items}/>
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
            <List.Item>
              <Card title={item.title}>Card content</Card>
            </List.Item>
          )}
        />
      </div>
    </SelfCourseStyled>
  )
}
