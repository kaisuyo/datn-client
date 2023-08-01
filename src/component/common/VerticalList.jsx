import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'
 
const { Text } = Typography

const VerticalListStyled = styled.div`
  width: 100%;

  .item-wrap {
    padding: 4px 0;

    .item {
      background: #f8f8f8;
      border: 1px solid rgba(0, 0, 0, 0.3);
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }

    .item.active {
      background: #ececec;
    }
  }
`

export default function VerticalList(props) {
  const { list, activeKey, handleChangeSelected, type } = props
  return (
    <VerticalListStyled>
      {list.map(item => (<div key={item.key} className='item-wrap'>
        <div className={`item ${item.key === activeKey ? 'active':''}`} onClick={() => handleChangeSelected(item.key, type)}>
          <strong>{item.title}</strong>
          <br />
          <Text>{item.description}</Text>
        </div>
      </div>))}
    </VerticalListStyled>
  )
}
