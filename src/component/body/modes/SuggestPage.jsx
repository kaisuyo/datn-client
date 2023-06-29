import { Button, message, Select, Space, Steps, Table } from 'antd';
import React, { useState } from 'react'
import styled from 'styled-components'

const SuggestPageStyled = styled.div`
  padding: 16px;

  .system-info {

  }

  .suggest-area {

  }
`

const columns = [
  {
    title: 'Người học',
    width: 100,
    dataIndex: 'username',
    key: 'username',
    fixed: 'left',
  },
  {
    title: 'Môn học',
    width: 100,
    dataIndex: 'subjectName',
    key: 'subjectName',
    fixed: 'left',
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
    width: 150,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
    width: 150,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
    width: 150,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
    width: 150,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
    width: 150,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
    width: 150,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
    width: 150,
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
  {
    title: 'Nhãn',
    key: 'operation',
    fixed: 'right',
    width: 120,
    render: () => (<Select 
      style={{width: "100%"}}
      options={[
        {label: 'NONE', value: "NONE"},
        {label: 'LOW', value: "LOW"},
        {label: 'MEDIUM', value: "MEDIUM"},
        {label: 'HIGH', value: "HIGH"}
      ]}
    />),
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    username: `Edward ${i}`,
    subjectName: "hehe",
    address: `London Park no. ${i}`,
  });
}

export default function SuggestPage() {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: 'Trích rút dữ liệu',
      content: 'First-content',
    },
    {
      title: 'Gán nhãn',
      content: 'Second-content',
    },
    {
      title: 'Phân cụm',
      content: 'Last-content',
    },
    {
      title: 'Gợi ý',
      content: 'Last-content',
    }
  ]

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <SuggestPageStyled>
      <div className="system-info"></div>
      <div className="suggest-area">
        <Steps current={current} items={items} />
        <div >
        <Table  
          size='small'
          columns={columns}
          dataSource={data}
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
          {current > 0 && (
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
        </Space>
      </div>
    </SuggestPageStyled>
  )
}
