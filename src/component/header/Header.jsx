import styled from 'styled-components'
import { Button } from 'antd'
import { useContext } from 'react'
import { UserContext } from '../../context/AppContext'
import { FUNC } from '../../context/enum'
import API from '../../context/config'

const HeaderStyled = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  background: #2424f8;
  display: flex;
  justify-content: space-between;

  .func-area {
    display: flex;

    .func {
      color: #dddada;
      padding: 8px 16px;
      font-size: 18px;
    }
    
    .func:not(.active):hover {
      cursor: pointer;
      color: white;
      background: #3939fd;
    }

    .func.active {
      background: #7676fc;
      color: white;
    }
  }
  
  .user-area {
    line-height: 36px;
    color: white;
  }
`

export default function Header(props) {
  const { curFunc, setCurFunc, funcs } = props
  const { user, setUser } = useContext(UserContext)

  const logout = () => {
    API.get('/users/logout').then(res => {
      setUser(null)
    }).catch(e => {
      setUser(null)
    })
  }
  
  return (
    <HeaderStyled>
      <div className="func-area">
        {funcs.filter(func => func.key >= FUNC.ALL_COURSES && func.isShow()).map(func => (
          <div 
            key={func.key}
            className={`func ${curFunc === func.key && "active"}`}
            onClick={() => setCurFunc(func.key)}
          >{func.name}</div>
        ))}
      </div>
      <div className="user-area">
        {user && <span>{user.username}</span>}
        {!user && <>
          <Button type='primary' onClick={() => setCurFunc(FUNC.LOGIN)}>
            Đăng nhập
          </Button>
          <Button type='primary' onClick={() => setCurFunc(FUNC.REGISTER)}>
            Đăng ký
          </Button>
        </>}
        {user && <Button type='primary' onClick={logout}>
          Đăng xuất
        </Button>}
      </div>
    </HeaderStyled>
  )
}
