import { Button, Card, Form, Input, List, Popconfirm, Select, Space } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'

const QuestionStyled = styled(Form)`
  .ant-form-item-control-input-content {
    width: min-content;
  }
`

export default function Question({params, deleteQuestion, saveQuestion}) {
  const [form] = Form.useForm()
  useEffect(() => {
    form.resetFields()
  }, [params])
  return (
    <QuestionStyled
      form={form}
      onFinish={(values) => saveQuestion({...values, questionId: params.questionId})}
      initialValues={params}
    >
      <List.Item>
        <Card size='small' style={{textAlign: 'left'}} hoverable>
          <Form.Item
            name={`description`}
            rules={[{ required: true, message: 'Không thể để trống câu hỏi!' }]}
          >
            <Input.TextArea placeholder='Nhập câu hỏi của bạn'/>
          </Form.Item>
          <Form.Item
            name={`optionA`}
            label="Đáp án A"     
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={`optionB`}
            label="Đáp án B"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={`optionC`}
            label="Đáp án C"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={`optionD`}
            label="Đáp án D"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={`answer`}
            label="Đáp án đúng"
            rules={[{ required: true, message: 'Câu hỏi phải có đáp án đúng!' }]}
          >
            <Select 
              options={[
                {
                  value: 'A',
                  label: 'A',
                },
                {
                  value: 'B',
                  label: 'B',
                },
                {
                  value: 'C',
                  label: 'C',
                },
                {
                  value: 'D',
                  label: 'D',
                },
              ]}
            />
          </Form.Item>
          <Space>
            <Form.Item>
              <Button size='small' htmlType='submit' type='primary' >Lưu câu hỏi</Button>
            </Form.Item>
            <Form.Item>
            <Popconfirm
              title={'Xóa câu hỏi'}
              onConfirm={() => deleteQuestion(params.questionId)}
              okText="Xóa"
              cancelText="Không xóa"
              description="Bạn thực sự muốn xóa câu hỏi tra này ?"
            >
              <Button size='small' danger type='primary'>Xóa câu hỏi</Button>
            </Popconfirm>
            </Form.Item>
          </Space>
        </Card>
      </List.Item>
    </QuestionStyled>
  )
}
