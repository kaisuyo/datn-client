import React, { useContext } from 'react'
import styled from 'styled-components'
import { Select, Typography, List, Button } from 'antd'
import { AppContext } from '../../App'

const { Title, Text } = Typography

const StatisticalStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 8px;
  
  .content {
    border-radius: 4px;
    background: white;
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    .top{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .footer {
      width: 100%;
      display: flex;

      .space-footer {
        flex-grow: 1;
      }
    }
  }
`

export default function Statistical(props) {
  const { changeItemFunc } = props
  const { user } = useContext(AppContext)
  const subjects = [
    {value: '1', label: "Toán"},
    {value: '2', label: "Vật lý"},
    {value: '3', label: "Hóa học"},
    {value: '4', label: "Sinh học"},
    {value: '5', label: "Ngữ văn"},
    {value: '6', label: "Tiếng Việt"},
    {value: '7', label: "Tiếng Anh"},
  ]

  const dataItem = [
    {displayText: "Đã đăng ký", value: 12, unit: "khóa học"},
    {displayText: "Đã xem", value: 24, unit: "bài giảng"},
    {displayText: "Đã làm", value: 13, unit: "bài kiểm tra"}
  ]
  return (
    <StatisticalStyled>
      <List
        className='content'
        size='small'
        header={
          <div className="top">
            <div>
            {!user || user.role === 0 && <Text>Thông tin học tập</Text>}
            {user && user.role === 1 && <Text>Thông tin môn học</Text>}
            </div>
            <div>
              <Select style={{width: 100}} defaultValue={subjects[0].value} options={subjects} />
            </div>
          </div>
        }
        footer={<div className='footer'><div className='space-footer'></div><Button onClick={() => changeItemFunc("statistical")} className='btn-more' type='link'>Chi tiết</Button></div>}
        bordered
        dataSource={dataItem}
        align='left'
        renderItem={(item) => (
          <List.Item>
            {user && user.role === 0 && <Text mark style={{width: 80}}>{`${item.displayText}:`}</Text>}
            <Text>{`${item.value}`} </Text>
            <Text style={{width: 80, textAlign: "right"}}>{`${item.unit}`} </Text>
          </List.Item>
        )}
      />
    </StatisticalStyled>
  )
}
