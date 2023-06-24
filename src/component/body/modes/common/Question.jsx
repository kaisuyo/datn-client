import { Button, Card, Col, Form, Input, List, Popconfirm, Row, Select, Space } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { COURSE_STATUS } from '../../../../context/enum'

const QuestionStyled = styled(Form)`
  .ant-form-item-control-input-content {
    width: min-content;
  }
`

export default function Question({params, deleteQuestion, saveQuestion, status}) {
  const [form] = Form.useForm()
  useEffect(() => {
    form.resetFields()
  }, [params])
  return (
    <List.Item>
      <QuestionStyled
        form={form}
        onFinish={(values) => saveQuestion({...values, questionId: params.questionId})}
        initialValues={params}
        disabled={status !== COURSE_STATUS.N0}
      >
          <Card size='small' style={{textAlign: 'left'}} hoverable>
            <Row>
              <Col span={12} style={{paddingRight: 8}}>
                <Form.Item
                  name={`description`}
                  rules={[{ required: true, message: 'Không thể để trống câu hỏi!' }]}
                >
                  <Input.TextArea style={{ height: 160, resize: 'none'}}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={12} style={{padding: '0 8px'}}>
                    <Form.Item
                      name={`optionA`}
                    >
                      <Input placeholder='Đáp án A' />
                    </Form.Item>
                    <Form.Item
                      name={`optionB`}
                    >
                      <Input placeholder='Đáp án B'/>
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{paddingLeft: 8}}>
                    <Form.Item
                      name={`optionC`}
                    >
                      <Input placeholder='Đáp án C'/>
                    </Form.Item>
                    <Form.Item
                      name={`optionD`}
                    >
                      <Input placeholder='Đáp án D'/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12} style={{padding: '0 8px'}}>
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
                  </Col>
                  <Col span={6} style={{padding: '0 8px'}}>
                    <Form.Item>
                      <Button htmlType='submit' type='primary' >Lưu câu hỏi</Button>
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{paddingLeft: 8}}>
                    <Popconfirm
                      title={'Xóa câu hỏi'}
                      onConfirm={() => deleteQuestion(params.questionId)}
                      okText="Xóa"
                      cancelText="Không xóa"
                      description="Bạn thực sự muốn xóa câu hỏi tra này ?"
                    >
                      <Button danger type='primary'>Xóa câu hỏi</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
      </QuestionStyled>
    </List.Item>
  )
}
