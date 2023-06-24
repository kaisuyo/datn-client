import { Badge, Card, Space } from 'antd'
import Typography from 'antd/es/typography/Typography'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import API from '../../../../context/config'
import { COURSE_STATUS } from '../../../../context/enum'

export default function Course({item}) {
  const { courseId } = item
  const [another, setAnother] = useState("Đang cập nhật")
  useEffect(() => {
    console.log(item);
    API.get(`/courses/another/${courseId}`).then(res => {
      if (res.data.value) {
        setAnother(res.data.value.user.username)
      }
    })
  }, [])
  return (
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
        <Space direction='vertical'>
          <Typography.Text>{item.description || 'Không có mô tả'}</Typography.Text>
          <Typography.Text type="secondary">Người đăng: {another}</Typography.Text>
        </Space>
      </Card>
    </Badge.Ribbon>
  )
}
