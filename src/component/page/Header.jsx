import React, { useContext } from 'react'
import styled from 'styled-components'
import { Button, Input, Typography } from 'antd'
import { AppContext } from '../../App'

const { Title, Text } = Typography

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;

  .search-courses {
    padding: 8px 16px;
    height: 100%;
    width: 720px;
  }

  .user-auth {
    line-height: 48px;
    .btn-user {
      margin-right: 8px;
      margin-left: 8px;
    }
  }


`

export default function Header(props) {
  const { curFunc, setShowAuth } = props
  const { user, setUser } = useContext(AppContext)

  return (
    <HeaderStyled>
      <div className="search-courses">
        {curFunc === 'courses' && <Input placeholder='Tìm kiếm khóa học' />}
      </div>
      <div className="user-auth">
        <Text>{user?.username}</Text>
        {user && <Button className='btn-user' onClick={() => setUser(null)}>Đăng xuất</Button>}
        {!user && <Button className='btn-user' type='primary' onClick={() => setShowAuth(1)}>Đăng nhập</Button>}
      </div>
    </HeaderStyled>
  )
}
