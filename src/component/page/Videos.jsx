import React, { useContext } from 'react'
import ItemForCourse from '../common/ItemForCourse'
import styled from 'styled-components'
import { AppContext } from '../../App'

const VideosStyled = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;

  .item-course {
    cursor: pointer;
    border-radius: 4px;
  }

  .item-course:hover {
    background: #f2f2f2;
  }
  .item-course.active {
    background-color: #ece9df;
  }
`

export default function Videos(props) {
  const { user } = useContext(AppContext)
  const { courseId, selected, select } = props
  const videos = [
    {videoId: "v1", title: "Test 1", rate: 2.5, description: "Bài kiểm tra 1"},
    {videoId: "v2", title: "Test 2", rate: 1, description: "Bài kiểm tra 2"},
    {videoId: "v3", title: "Test 3", rate: 4.5, description: "Bài kiểm tra 3"},
    {videoId: "v4", title: "Test 4", rate: 3, description: "Bài kiểm tra 4"},
    {videoId: "v5", title: "Test 5", rate: 2, description: "Bài kiểm tra 5"},
    {videoId: "v6", title: "Test 6", rate: 2, description: "Bài kiểm tra 6"},
    {videoId: "v7", title: "Test 7", rate: 3.5, description: "Bài kiểm tra 7"},
    {videoId: "v8", title: "Test 8", rate: 4, description: "Bài kiểm tra 8"},
    {videoId: "v9", title: "Test 9", rate: 5, description: "Bài kiểm tra 9"},
  ]
  const newVideo = {
    videoId: "vNew", title: "Bài giảng mới", rate: 0, description: "Chỉnh sửa thông tin bài giảng"
  }
  return (
    <VideosStyled>
      {(user && user.role === 0 ? videos : [newVideo, ...videos]).map((video, index) => (
        <div 
          key={video.videoId} 
          className={`item-course ${selected === video.videoId ? "active":""}`}
          onClick={() => select(video.videoId)}
        >
          <ItemForCourse title={video.title} description={video.description} index={index+(user && user.role === 0) ? 1:0} />
        </div>
      ))}
    </VideosStyled>
  )
}
