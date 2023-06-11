import React from 'react'
import styled from 'styled-components'
import { Table } from 'antd';

const SuperStatisticalStyled = styled.div`
  padding: 8px;
  width: 100%;
  height: 100%;

  .content-info {
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 4px;
    padding: 8px;
    background: white;
  }

`

export default function SuperStatistical() {
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name'
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      defaultSortOrder: 'descend',
      filters: [
        {text: "Toán", value: "Toán"},
        {text: "Vật lý", value: "Vật lý"},
        {text: "Hóa học", value: "Hóa học"},
        {text: "Sinh học", value: "Sinh học"},
        {text: "Lịch sử", value: "Lịch sử"},
        {text: "Văn học", value: "Văn học"},
        {text: "GDCD", value: "GDCD"},
      ],
      onFilter: (value, record) => record.subject.indexOf(value) === 0,
    },
    {
      title: 'Tổng giờ học',
      dataIndex: 'leanTime',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.leanTime - b.leanTime,
    },
    {
      title: 'Đã xem',
      dataIndex: 'videoTotal',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.videoTotal - b.videoTotal,
    },
    {
      title: 'Đã làm',
      dataIndex: 'tested',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.tested - b.tested,
    },
    {
      title: 'Bình chọn bài giảng',
      dataIndex: 'videoRate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.videoRate - b.videoRate,
    },
    {
      title: 'Bình chọn bài kiểm tra',
      dataIndex: 'testRate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.testRate - b.testRate,
    },
    {
      title: 'Điểm trung bình',
      dataIndex: 'score',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.score - b.score,
    },
  ];
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      subject: ["Toán", "Vật lý", "Hóa học", "Sinh học", "Lịch sử", "Văn học", "GDCD"][Math.floor(Math.random() *7)],
      leanTime: Math.floor(Math.random() *20 + 20),
      videoTotal: Math.floor(Math.random() *20 + 20),
      tested: Math.floor(Math.random() *20 + 20),
      videoRate: Math.floor(Math.random()*5),
      testRate: Math.floor(Math.random()*5),
      score: Math.floor(Math.random()*10)
    });
  }
  
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <SuperStatisticalStyled>
      <div className="content-info">
        <Table 
          columns={columns} 
          dataSource={data} 
          onChange={onChange} 
          pagination={{
            pageSize: 50,
          }}
          scroll={{
            y: 420,
          }}
        />
      </div>
    </SuperStatisticalStyled>
  )
}
