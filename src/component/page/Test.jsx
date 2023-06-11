import { Card, Form, Radio, Typography, Space, Rate, Button, Empty, Input } from 'antd'
import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import Countdown from 'react-countdown'
import { AppContext } from '../../App'

const { Title, Text } = Typography
const { TextArea } = Input

const TestStyled = styled.div`
  padding-left: 8px;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 8px;

  .questions {
    width: 70%;
    height: 100%;
    overflow: scroll;
    padding: 8px;
  }

  .support {
    flex-grow: 1;
    height: 100%;
    padding: 8px;
    border-left: 1px solid rgba(0, 0, 0, 0.2);

    .suport-footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .update-question-area {
      height: 100%;
      width: 100%;

      .update-question {
        width: 100%;
      }
    }
  }
`

export default function Test(props) {
  const { user } = useContext(AppContext)
  const dataTest = {
    title: "Bài kiểm tra thử",
    description: "Bài kiểm tra thử",
    estimate: 15*60*1000,
    questions: [
      {
        title: "Câu 1",
        description: "Câu hỏi?",
        id: 1,
        answers: [
          {title: "A", description: "1", id: 1},
          {title: "B", description: "2", id: 2},
          {title: "C", description: "3", id: 3},
          {title: "D", description: "4", id: 4}
        ]
      },
      {
        title: "Câu 2",
        description: "Câu hỏi?",
        id: 2,
        answers: [
          {title: "A", description: "1", id: 1},
          {title: "B", description: "2", id: 2},
          {title: "C", description: "3", id: 3},
          {title: "D", description: "4", id: 4}
        ]
      },
      {
        title: "Câu 3",
        description: "Câu hỏi?",
        id: 3,
        answers: [
          {title: "A", description: "1", id: 1},
          {title: "B", description: "2", id: 2},
          {title: "C", description: "3", id: 3},
          {title: "D", description: "4", id: 4}
        ]
      },
      {
        title: "Câu 4",
        description: "Câu hỏi?",
        id: 4,
        answers: [
          {title: "A", description: "1", id: 1},
          {title: "B", description: "2", id: 2},
          {title: "C", description: "3", id: 3},
          {title: "D", description: "4", id: 4}
        ]
      },
      {
        title: "Câu 5",
        description: "Câu hỏi?",
        id: 5,
        answers: [
          {title: "A", description: "1", id: 1},
          {title: "B", description: "2", id: 2},
          {title: "C", description: "3", id: 3},
          {title: "D", description: "4", id: 4}
        ]
      }
    ]
  }
  const { testId } = props
  const formRef = useRef()
  const clockRef = useRef()
  const [isStart, setStart] = useState(false)
  const [curUpdate, setCurUpdate] = useState(null)

  const finish = (values) => {
    console.log(values);
  }

  const submit = () => {
    clockRef.current.pause()
    formRef.current.submit()
  }

  const start = () => {
    setStart(true)
    clockRef.current.start()
  }

  const renderer = ({ hours, minutes, seconds, completed }) => {
    return <span>{(hours + "").padStart(2, '0')}:{(minutes + "").padStart(2, '0')}:{(seconds + "").padStart(2, '0')}</span>;
  };

  const newQuestion = {
    title: "Câu 0",
    description: "Chưa có nội dung câu hỏi",
    id: 0,
    answers: [
      {title: "A", description: "", id: 1},
      {title: "B", description: "", id: 2},
      {title: "C", description: "", id: 3},
      {title: "D", description: "", id: 4}
    ]
  }

  return (
    <TestStyled>
      <div className="questions">
        <Form onFinish={finish} ref={formRef}>
          {isStart || (user && user.role === 1) ? (user.role === 0 ? dataTest.questions : [newQuestion, ...dataTest.questions]).map(question => (
            <Form.Item key={question.id} name={question.id}>
              <Card hoverable bodyStyle={{width: "100%", background: (curUpdate === question.id)? "#ece9df":"white"}} onClick={() => setCurUpdate(question.id)} >
                <Text><strong>{question.title}{". "}</strong></Text>
                <Text>{question.description}</Text>
                <br />
                <br />
                <Radio.Group>
                  <Space size="large">
                    {question.answers?.map(answer => (
                      <Radio key={answer.id} value={answer.title} >{answer.title}. {answer.description}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Card>
            </Form.Item>
          )) : <Empty description="Chưa bắt đầu làm bài" />}
        </Form>
      </div>
      <div className="support">
        <Form>
        {user && user.role === 0 && <>
          <Title level={5}>{dataTest.title}</Title>
          <Text>{dataTest.description}</Text>
          <hr />
          <Text>Đánh giá: </Text>
          <Rate allowHalf defaultValue={3.5} />
          <hr />
        </>}
        {user && user.role === 1 && <>
            <Form.Item name='newTitle'>
              <Input placeholder='Tiêu đề mới'/>
            </Form.Item>
            <Form.Item name='newDescription'>
              <TextArea placeholder='Mô tả bài kiểm tra' />
            </Form.Item>
            <Form.Item name='newEstimate'>
              <Input type='number' placeholder='Thời gian làm bài (phút)' />
            </Form.Item>
        </>}
        <div className="suport-footer">
          {user && user.role === 0 && <>
            <Countdown ref={clockRef} onComplete={submit} autoStart={false} date={Date.now() + dataTest.estimate} renderer={renderer} />
            {!isStart && <Button onClick={start}>Làm bài</Button>}
            {isStart && <Button onClick={submit} type='primary'>Nộp bài</Button>}
          </>}
          {user && user.role === 1 && <div className="update-question-area">
            {curUpdate !== null && <div className="update-question">
              <hr />
              <Form.Item name="newQuestion">
                <TextArea placeholder='Sửa câu hỏi ở đây' />
              </Form.Item>
              <Space>
                <Form.Item name="aA">
                  <Input placeholder='A là' style={{width: "56px"}}/>
                </Form.Item>
                <Form.Item name="aB">
                  <Input placeholder='B là' style={{width: "56px"}}/>
                </Form.Item>
                <Form.Item name="aC">
                  <Input placeholder='C là' style={{width: "56px"}}/>
                </Form.Item>
                <Form.Item name="aD">
                  <Input placeholder='D là' style={{width: "56px"}}/>
                </Form.Item>
              </Space>
              <Form.Item name="trueAnswer">
                <Input placeholder='Đáp án đúng' />
              </Form.Item>
            </div>}
            <Form.Item>
              <Button danger>Xóa câu hỏi này</Button>
            </Form.Item>
            <Space>
              <Button type='primary' htmlType="submit">Lưu</Button>
              <Button danger>Xóa bài kiểm tra này</Button>
            </Space>
          </div>}
        </div>
        </Form>
      </div>
    </TestStyled>
  )
}