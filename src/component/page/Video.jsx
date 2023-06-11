import { Button, Form, Input, Rate, Space, Typography } from 'antd'
import React, { useContext } from 'react'
import YouTube from 'react-youtube'
import styled from 'styled-components'
import { AppContext } from '../../App'

const { TextArea } = Input
const { Text } = Typography

const VideoStyled = styled.div`
  padding-left: 8px;
  width: 100%;

  .update-video {
    padding: 8px;
  }
`

export default function Video(props) {
  const { videoId } = props
  const { user } = useContext(AppContext)

  console.log(videoId);

  return (
    <VideoStyled>
      {videoId !== "vNew" && <div className="video">
        <YouTube 
          videoId='PkGVqlpOyxA'
        />
      </div>}
      {user && user.role === 0 && <div className='rate'>
        <Text>Đánh giá:</Text>
        <Rate allowHalf defaultValue={2.5} />
      </div>}
      {user && user.role === 1 && <div className='update-video'>
        <Form>
          <Space>
            <Space direction="vertical">
              <Form.Item name="newTitle" label='Tiêu đề bài giảng'>
                <Input />
              </Form.Item>
              <Form.Item name="newURL" label='Đường dẫn mới'>
                <Input />
              </Form.Item>
            </Space>
            <Form.Item name="newDesctiption" label="Thêm mô tả">
              <TextArea rows={4} />
            </Form.Item>
            <Space direction="vertical">
              <Form.Item>
                <Button type='primary' htmlType='submit'>Lưu</Button>
              </Form.Item>
              {videoId !== "vNew" && <Form.Item>
                <Button danger >Xóa bài giảng</Button>
              </Form.Item>}
            </Space>
          </Space>
        </Form>
      </div>}
    </VideoStyled>
  )
}
