import { Radio, Card, Form, List, Row, Space, Typography, Col } from 'antd'
import React from 'react'

export default function QuestionForm({params}) {return (
    <List.Item>
      <Card size='small' style={{textAlign: 'left'}} hoverable>
        <Row>
          <Col span={24}>
            <Typography.Title level={5}>Câu hỏi: {params.description}</Typography.Title>
            <Form.Item
              name={`${params.questionId}`}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value='A'>{params.optionA}</Radio>
                  <Radio value='B'>{params.optionB}</Radio>
                  <Radio value='C'>{params.optionC}</Radio>
                  <Radio value='D'>{params.optionD}</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </List.Item>
  )
}
