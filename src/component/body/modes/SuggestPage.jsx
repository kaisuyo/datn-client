import { Button, message, Modal, Popconfirm, Select, Space, Steps, Table, Tooltip } from 'antd';
import React, { useState } from 'react'
import { useEffect } from 'react';
import styled from 'styled-components'
import API from '../../../context/config';
import toastr from 'toastr';

const SuggestPageStyled = styled.div`
  padding: 16px;

  .system-info {

  }

  .suggest-area {

  }
`


export default function SuggestPage() {
  const [curStep, setCurStep] = useState(0);
  const [learnResults, setLearnResult] = useState([])

  const getAllData = () => {
    API.get('/suggest/all').then(res => {
      if (res.data.value) {
        setLearnResult(res.data.value.map(d => ({
          ...d, 
          key: `${d.userId}_${d.subjectId}`, 
          username: d.user.username,
          title: d.subject.title
        })))
      }
    })
  }
  
  useEffect(() => {
    getAllData()
  }, [])

  const saveRecord = (record, value) => {
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
    })
  }

  const calculate = () => {
    toastr.warning("Việc tính toán của hệ thống có thể mất vài phút. Bạn có thể quay lại trang này sau.")
    setLearnResult([])
    API.get('/suggest/calculate').then(res => {
      getAllData()
    }).catch(e => {
      toastr.warning("Hệ thống mất quá nhiều thời gian phản hồi. Bạn có thể quay lại trang này sau.")
    })
  }

  const columns = [
    {
      title: 'Người học',
      width: 150,
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
    {
      title: 'Gợi ý',
      key: 'suggest',
      fixed: 'right',
      width: 150,
      render: (text, record) => (<Button disabled={!record.label} style={{width: "100%"}} type='primary'>Chọn khóa học</Button>),
    },
  ];

  return (
    <SuggestPageStyled>
      <div className="system-info"></div>
      <div className="suggest-area">
        <div >
          <Table  
            size='small'
            columns={columns}
            dataSource={learnResults}
            scroll={{
              x: 1500
            }}
            bordered 
            pagination={{
              pageSize: 8,
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
            } type='primary'>Xác nhận nhãn & phân cụm</Button>}
          {<Button disabled={learnResults.length < 1 || learnResults.some(l => !l.label)} type='primary'>Gợi ý tự động</Button>}
        </Space>
      </div>

      <Modal>
        
      </Modal>
    </SuggestPageStyled>
  )
}
