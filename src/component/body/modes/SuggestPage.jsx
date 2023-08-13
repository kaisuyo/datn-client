import { Button, Form, Modal, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import React, { useState } from 'react'
import { useEffect } from 'react';
import styled from 'styled-components'
import API from '../../../context/config';
import toastr from 'toastr';
import SuggestCourses from './common/SuggestCourses';
import { useContext } from 'react';
import { UserContext } from '../../../context/AppContext';

const SuggestPageStyled = styled.div`
  padding: 16px;

  .system-info {

  }

  .suggest-area {

  }
`

export default function SuggestPage() {
  const [showConfigClustering, setShowConfigClustering] = useState(false);
  const [learnResults, setLearnResult] = useState([])
  const [subjects, setSubjects] = useState([])

  const { setLoading } = useContext(UserContext)

  const getAllData = () => {
    setLoading(true)
    API.get('/suggest/all').then(res => {
      if (res.data.value) {
        setLearnResult(res.data.value.map(d => ({
          ...d, 
          key: `${d.userId}_${d.subjectId}`, 
          username: d.user.username,
          title: d.subject.title
        })))
      }
    }).finally(() => {
      setLoading(false)
    })

    API.post('common/subjects').then(res => {
      if (res.data.value) {
        setSubjects(res.data.value)
      }
    })
  }
  
  useEffect(() => {
    getAllData()
  }, [])

  const saveRecord = (record, value) => {
    setLoading(true)
    API.post('/suggest/update', {userId: record.userId, subjectId: record.subjectId, label: value}).then(res => {
      if (res.data.value) {
        const newList = [...learnResults]
        const index = newList.findIndex(e => e.userId === record.userId && e.subjectId === record.subjectId)
        newList[index] = {
          ...res.data.value, 
          key: `${record.userId}_${record.subjectId}`, 
          username: record.username,
          title: record.title
        }
        console.log(new Set(newList.map(l => l.label)));
        setLearnResult(newList)
      }
    }).finally(() => {
      setLoading(false)
    })
  }


  const calculate = () => {
    toastr.warning("Việc tính toán của hệ thống có thể mất vài phút")
    setLearnResult([])
    setLoading(true)
    API.get('/suggest/calculate').then(res => {
      getAllData()
    }).catch(e => {
      toastr.warning("Hệ thống mất quá nhiều thời gian phản hồi")
    }).finally(() => {
      setLoading(false)
    })
  }


  const [showModal, setShowModal] = useState(null)
  const handleShowCourse = (record) => {
    setShowModal(record)
  }

  const columns = [
    {
      title: 'Người học',
      width: 160,
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      render: (text, record) => (<Tooltip title={record.userId}>
        {text}
      </Tooltip>) 
    },
    {
      title: 'Môn học',
      width: 150,
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
    },
    {
      title: 'Đánh giá trung bình',
      dataIndex: 'rate',
      key: '1',
      width: 150,
    },
    {
      title: 'Thời gian làm bài trung bình',
      dataIndex: 'timeTest',
      key: '2',
      width: 150,
    },
    {
      title: 'Thời gian xem video trung bình',
      dataIndex: 'timeVideo',
      key: '3',
      width: 150,
    },
    {
      title: 'Điểm trung bình',
      dataIndex: 'score',
      key: '4',
      width: 150,
    },
    {
      title: 'Làm kiểm tra',
      dataIndex: 'testTimes',
      key: '5',
      width: 150,
    },
    {
      title: 'Lần xem video',
      dataIndex: 'videoTimes',
      key: '6',
      width: 150,
    },
    {
      title: 'Khóa học đăng ký',
      dataIndex: 'courseTotal',
      key: '7',
      width: 150,
    },
    {
      title: 'Nhãn',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (text, record) => (<Select 
        size='small'
        onChange={(value) => saveRecord(record, value)}
        style={{width: "100%"}}
        value={record.label}
        options={[
          {label: 'NONE', value: "NONE"},
          {label: 'LOW', value: "LOW"},
          {label: 'MEDIUM', value: "MEDIUM"},
          {label: 'HIGH', value: "HIGH"}
        ]}
      />),
    },
  ];

  const [configForm] = Form.useForm()

  const handleClustering = () => {
    configForm.submit()
  }

  const configFormSubmit = (values) => {
    toastr.warning("Quá trình phân cụm có thể mất nhiều thời gian.")
    setLoading(true)
    API.post('/suggest/clustering', {values}).then(res => {
      if (res.data.value) {
        setShowConfigClustering(false)
        toastr.warning("Quá trình phân cụm đã hoàn tất")
        getAllData()
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const arrToObj = (arr) => {
    const result = {}
    arr.forEach(e => {
      result[e.subjectId] = 0
    })

    return result
  }

  const [phase2Data, setPhase2Data] = useState([])
  const createGeneralUserData = () => {
    const tempData = []
    const TMP = {
      NONE: 0,
      LOW: 3.33,
      MEDIUM: 6.67,
      HIGH: 10
    }
    learnResults.forEach(e => {
      let dataIndex = tempData.findIndex(x => x.userId === e.userId)
      if (dataIndex === -1) {
        dataIndex = tempData.push({key: e.userId, userId: e.userId, username: e.username, ...arrToObj(subjects)}) - 1
      }

      tempData[dataIndex][e.subjectId] = TMP[e.label]
    })

    setPhase2Data(tempData)
    window.scrollTo(0, document.body.scrollHeight);
  }

  return (
    <SuggestPageStyled>
      <div className="system-info"></div>
      <div className="suggest-area">
        <div>
          <Table  
            size='small'
            columns={columns}
            dataSource={learnResults}
            scroll={{
              x: 1500
            }}
            bordered 
            pagination={{
              pageSize: 9,
            }} 
          />
        </div>
        <Space style={{width: "100%", justifyContent: 'center'}}>
          {<Popconfirm
            title="Trích rút dữ liệu"
            description="Xóa hết dữ liệu học tập đã tình toán từ trước và tính toán lại ?"
            okText="Đồng ý"
            cancelText="Không"
            onConfirm={calculate}
          >
            <Button type='primary' danger>Trích rút dữ liệu</Button>
          </Popconfirm>}
          {<Button 
            disabled={
              learnResults.length < 1 || 
              !(
                learnResults.map(l => l.label).includes('LOW') && 
                learnResults.map(l => l.label).includes('HIGH') &&
                learnResults.map(l => l.label).includes('MEDIUM') &&
                learnResults.map(l => l.label).includes('NONE')
              )
            } type='primary' onClick={() => setShowConfigClustering(true)}>Xác nhận nhãn & phân cụm</Button>}
          {<Button disabled={learnResults.length < 1 || learnResults.some(l => !l.label)} onClick={createGeneralUserData} type='primary'>Tổng hợp</Button>}
        </Space>
      </div>

      {phase2Data.length > 0 && <div>
        <hr />
        <Table 
          bordered
          size='small'
          pagination={{
            pageSize: 12,
          }} 
          dataSource={phase2Data}
          columns={[
            {
              title: 'ID',
              width: 80,
              dataIndex: 'userId',
              key: 'userId',
              fixed: 'left',
              filters: phase2Data.map(d => ({text: d.userId, value: d.userId})),
              filterSearch: true,
              onFilter: (value, record) => `${record.userId}`.startsWith(`${value}`),
            },
            {
              title: 'Người học',
              width: 180,
              dataIndex: 'username',
              key: 'username',
              fixed: 'left',
              render: (text, record) => (<Tooltip title={record.userId}>
                {text}
              </Tooltip>) 
            },
            ...(subjects.map(e => ({
              title: e.title,
              dataIndex: `${e.subjectId}`,
              key: `${e.subjectId}`,
              width: 150,
              render: (text, record) => (
                <div style={{textAlign: 'left'}}>{text}</div>
              )
            }))),
            {
              title: 'Gợi ý',
              key: 'suggest',
              fixed: 'right',
              width: 150,
              render: (text, record) => (
                <Button 
                  size='small' 
                  onClick={() => handleShowCourse(record)} 
                  style={{width: "100%"}} 
                  type='primary'>
                    Các khóa học
                  </Button>
                ),
            },
          ]}
          scroll={{ x: 'max-content' }}
        />
      </div>}

      <Modal
        open={showConfigClustering}
        onCancel={() => setShowConfigClustering(false)}
        title="Thông tin nhãn đã được gán"
        okText="Bắt đầu phân cụm"
        onOk={() => {handleClustering(); setShowConfigClustering(false)}}
      >
        <Space size='large'>
          <Table 
            size='small'
            pagination={false}
            dataSource={[
              {title: 'HIGH', color: 'red', key: 'HIGH', num: learnResults.map(l => l.label).filter(l => l === 'HIGH').length, total: learnResults.length},
              {title: 'MEDIUM', color: 'orange', key: 'MEDIUM', num: learnResults.map(l => l.label).filter(l => l === 'MEDIUM').length, total: learnResults.length},
              {title: 'LOW', color: 'yellow', key: 'LOW', num: learnResults.map(l => l.label).filter(l => l === 'LOW').length, total: learnResults.length},
              {title: 'NONE', color: 'green', key: 'NONE', num: learnResults.map(l => l.label).filter(l => l === 'NONE').length, total: learnResults.length},
            ]}
            columns={[
              {
                title: 'Giám sát',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => (<>
                  <Tag color={record.color} key={record.key}>
                    {record.title}
                  </Tag>
                </>)
              },
              {
                title: 'Số lượng',
                dataIndex: 'num',
                key: 'num'},
              {
                title: 'Tổng số',
                dataIndex: 'total',
                key: 'total'}
            ]}
          />
          <Form
            form={configForm}
            onFinish={configFormSubmit}
            initialValues={{
              M: 2,
              epsilon: 0.0001
            }}
          >
          </Form>
        </Space>
      </Modal>

      <Modal
        open={!!showModal}
        title={`Gợi ý khóa học ${showModal? `cho ${showModal?.username}`:""}`}
        centered
        onCancel={() => setShowModal(false)}
        width={1000}
        onOk={() => setShowModal(false)}
      >
        <SuggestCourses user={showModal}/>
      </Modal>
    </SuggestPageStyled>
  )
}
