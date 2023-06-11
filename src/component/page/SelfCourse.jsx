import React from 'react'
import styled from 'styled-components'
import { List, Typography, Card, Progress } from 'antd'

const { Title, Text } = Typography

const SelfCourseStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;

  .content {
    background-color: white;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    .top {
      padding: 8px 16px;
    }
    .self-course {
      padding: 8px 16px;
      width: 100%;
      height: calc(100% - 48px);
      overflow: scroll;

      .card-self-course {
        height: 80px;
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.1s linear;
        display: flex;
        overflow: hidden;

        .img {
          width: 40%;
          height: 100%;
        }
      }

      .card-self-course:hover {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
    }
  }
`

export default function SelfCourse(props) {
  const { setCourseId } = props
  const selfCourseList = [
    {
      courseId: 1, 
      title: "Khóa học đã đăng ký",
      description: "Mô tả khóa học đã đăng ký",
      progress: Math.floor(Math.random()*100),
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 2, 
      title: "Khóa học đã đăng ký",
      description: "Mô tả khóa học đã đăng ký",
      progress: Math.floor(Math.random()*100),
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 3, 
      title: "Khóa học đã đăng ký",
      description: "Mô tả khóa học đã đăng ký",
      progress: Math.floor(Math.random()*100),
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 4, 
      title: "Khóa học đã đăng ký",
      description: "Mô tả khóa học đã đăng ký",
      progress: Math.floor(Math.random()*100),
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 5, 
      title: "Khóa học đã đăng ký",
      description: "Mô tả khóa học đã đăng ký",
      progress: Math.floor(Math.random()*100),
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
    {
      courseId: 6, 
      title: "Khóa học đã đăng ký",
      description: "Mô tả khóa học đã đăng ký",
      progress: Math.floor(Math.random()*100),
      image: 'https://images.pexels.com/photos/794494/pexels-photo-794494.jpeg?cs=srgb&dl=pexels-anthony-%29-794494.jpg'
    },
  ]
  return (
    <SelfCourseStyled>
      <div className="content">
        <div className="top">
          <Title level={5} style={{textAlign: 'left'}}>Khóa học của bạn</Title>
        </div>
        <div className="self-course">
          <List 
            dataSource={selfCourseList}
            renderItem={item => (
              <List.Item>
                <div className="card-self-course" onClick={() => setCourseId(item.courseId)}>
                  <div className="img" style={{background: `url(${item.image})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>
                  <div className="course-content">
                    <Title level={5}>{item.title}</Title>
                    <Progress style={{padding: "0 8px"}} percent={item.progress} />
                  </div>
                </div>
              </List.Item>
            )}
          />
          <div className="test"></div>
        </div>
      </div>
    </SelfCourseStyled>
  )
}
