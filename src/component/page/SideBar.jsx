import React, { useContext, useState } from 'react'
import { Typography } from 'antd'
import styled from 'styled-components'
import { AppContext } from '../../App'

const { Title, Text } = Typography
const SideBarStyled = styled.div`
  .func {
    width: 100%;
  }
  .itemFunc {
    padding: 8px 16px;
    background: #3151f1;
    color: #cecdcd;
  }
  .itemFunc:hover:not(.active) {
    background: #3b5af8;
    cursor: pointer;
    color: white;
  }
  
  .itemFunc.active {
    color: orange;
    background: #5973f5;
  }
`


export default function SideBar(props) {
  const { curFunc, changeItemFunc } = props
  const { user } = useContext(AppContext)
  
  return (
    <SideBarStyled>
      <Title style={{padding: "16px", color: "white"}} level={4}>LearnRec</Title>

      <div className='func'>
        <div onClick={() => changeItemFunc("courses")} className={`itemFunc ${curFunc === 'courses' ? 'active' : ''}`} >{"Khóa học"}</div>
      </div>
      {user && <div className='func'>
        <div onClick={() => changeItemFunc("statistical")} className={`itemFunc ${curFunc === 'statistical' ? 'active' : ''}`} >{"Chi tiết học tập"}</div>
      </div>}
      {user && user.role === 1 && <div className='func'>
        <div onClick={() => changeItemFunc("suggestion")} className={`itemFunc ${curFunc === 'suggestion' ? 'active' : ''}`} >{"Gợi ý khóa học"}</div>
      </div>}
    </SideBarStyled>
  )
}
