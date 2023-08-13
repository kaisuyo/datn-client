import { Badge, Card, Space } from 'antd'
import Typography from 'antd/es/typography/Typography'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { UserContext } from '../../../../context/AppContext'
import API from '../../../../context/config'
import { COURSE_STATUS, ROLE } from '../../../../context/enum'

export default function Course({item}) {
  const { courseId } = item
  const [another, setAnother] = useState("Đang cập nhật")
  const [subject, setSubject] = useState("Đang cập nhật")
  const { user } = useContext(UserContext)
  useEffect(() => {
    API.post(`common/courses/subInfo`, {courseId}).then(res => {
      if (res.data.value) {
        setAnother(res.data.value.another)
        setSubject(res.data.value.subject)
      }
    })
  }, [])
  return (
    <Badge.Ribbon 
      text={
        item.status === COURSE_STATUS.WAIT ? "Chờ duyệt" :
        (item.status === COURSE_STATUS.BLOCK ? "Bảo trì" : 
        (item.status === COURSE_STATUS.N0 ? "Chỉnh sửa":"Đã duyệt"))
      }
      color={
        item.status === COURSE_STATUS.WAIT ? "magenta" :
        (item.status === COURSE_STATUS.BLOCK ? "red" : 
        (item.status === COURSE_STATUS.N0 ? "purple":"green"))
      }
    >
      <div title={item.title}>
      <Card size='small' hoverable title={item.title}>
        <Space direction='vertical'>
          <Typography.Text>{item.description || 'Không có mô tả'}</Typography.Text>
          <Typography.Text type="secondary">Môn học: {subject}</Typography.Text>
          {user?.role !== ROLE.PROVIDER && <Typography.Text type="secondary">Người đăng: {another}</Typography.Text>}
        </Space>
      </Card>
      </div>
    </Badge.Ribbon>
  )
}
