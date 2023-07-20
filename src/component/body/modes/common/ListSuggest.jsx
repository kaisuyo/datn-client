import { Button, List, Space } from 'antd';
import React from 'react'
import styled from 'styled-components';

const StyledList = styled(List)`
  width: 200px;
  height: 380px;
  overflow: scroll;
`;

export default function ListSuggest({ children, dataSource, handleItem, danger }) {
  return (
    <div>
      <StyledList
        size="small"
        bordered
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item title={item.tooltip}>
            <Space style={{width: '100%', justifyContent: 'inherit'}}>
              {item.label}
              {handleItem ? <Button size='small' type="primary" danger={danger} onClick={() => handleItem(item)}>
                { children }
              </Button> : children}
            </Space>
          </List.Item>
        )}
      />
    </div>
  )
}
