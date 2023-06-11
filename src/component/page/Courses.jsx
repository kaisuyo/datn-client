import React, { useContext } from 'react'
import styled from 'styled-components'
import { Card, List, Popconfirm, Typography } from 'antd'
import { AppContext } from '../../App'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography

const CoursesStyled = styled.div`
  width: 100%;
  height: 100%; 
  padding: 0 8px;

  .course-list {
    width: 100%;
    height: calc(100% - 8px);
    overflow-y: scroll;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 8px;
    
  }
`

export default function Courses(props) {
  const { setCourseId, setShowAuth } = props
  const { user } = useContext(AppContext)

  const courseList = [
    {
      courseId: 1,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 2,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 3,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 4,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 5,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 6,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 7,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 8,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 9,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 10,
      title: "Khóa học",
      description: "Mô tả khóa học",
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    }
  ]

  const confirm = (e) => {

  }

  const cancel = (e) => {

  }
  return (
    <CoursesStyled>
      <div className='course-list'>
      <List grid={{gutter: 16, column: 4}} 
        dataSource={courseList}
        renderItem={item => (
          <List.Item>
            <Card 
              onClick={() => {
                return !user ? setShowAuth(1) : (user.role === 0 ? setCourseId(item.courseId) : undefined)
              }}
              cover={<img src={item.image} />} 
              hoverable
              actions={ (user && user.role) ? [
                <EditOutlined key="edit" onClick={() => setCourseId(item.courseId)} />,
                <Popconfirm
                  title="Xóa khóa học này"
                  description="Bạn chắc chắn muốn xóa ?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Xóa"
                  cancelText="Không"
                >
                  <DeleteOutlined key="delete" style={{color: "red"}} />,
                </Popconfirm>
              ] : []}
            >
              <Title level={5}>{item.title}</Title>
              <Text>{item.description}</Text>
            </Card>
          </List.Item>
        )}
      />
      </div>
    </CoursesStyled>
  )
}
