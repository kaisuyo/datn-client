import { Typography, List, Card, Space } from 'antd'
import React from 'react'

export default function QuestionReadOnly({params}) {
  return (
    <List.Item>
      <Card size='small' style={{textAlign: 'left'}} hoverable>
        <Space direction='vertical'>
          <Typography.Text>Câu hỏi: {params.description}</Typography.Text>
          <Typography.Text>A.{params.optionA}</Typography.Text>
          <Typography.Text>B.{params.optionB}</Typography.Text>
          <Typography.Text>C.{params.optionC}</Typography.Text>
          <Typography.Text>D.{params.optionD}</Typography.Text>
          <Typography.Text>Đáp án đúng: {params.answer}</Typography.Text>
        </Space>
      </Card>
    </List.Item>
  )
}
