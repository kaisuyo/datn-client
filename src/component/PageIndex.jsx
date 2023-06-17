import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/AppContext'
import { FUNC, ROLE } from '../context/enum'
import Body from './body/Body'
import LoginPage from './body/modes/LoginPage'
import RegisterPage from './body/modes/RegisterPage'
import Header from './header/Header'
import API from '../context/config'

export default function PageIndex() {
  const [curFunc, setCurFunc] = useState(0)
  const { user, setUser } = useContext(UserContext)
  const funcs = [
    {
      key: FUNC.LOGIN,
      name: 'Đăng nhập',
      tab: (<LoginPage />)
    },
    {
      key: FUNC.REGISTER,
      name: 'Đăng ký',
      tab: (<RegisterPage />)
    },
    {
      key: FUNC.ALL_COURSES, 
      name: "Khóa học",
      isShow: () => (true),
      tab: (<></>)
    },
    {
      key: FUNC.SELF_COURSES, 
      name: "Đã đăng ký",
      isShow: () => (user && user.role === ROLE.USER)
    },
    {
      key: FUNC.SUBJECTS, 
      name: "Môn học",
      isShow: () => (user && user.role === ROLE.SYSTEM_USER)
    },
    {
      key: FUNC.USERS, 
      name: "Người dùng", 
      isShow: () => (user && user.role === ROLE.SYSTEM_USER)
    },
    {
      key: FUNC.SUGGEST, 
      name: "Gợi ý khóa học",
      isShow: () => (user && user.role === ROLE.SYSTEM_USER)
    }
  ]

  useEffect(() => {
    API.get('/users/').then(res => {
      if (res.data.value) {
        setUser(res.data.value)
      }
    })
  }, [])

  useEffect(() => {
    setCurFunc(FUNC.ALL_COURSES)
  }, [user])

  return (
    <div>
      <Header curFunc={curFunc} setCurFunc={setCurFunc} funcs={funcs} />
    <Body curFunc={curFunc} setCurFunc={setCurFunc} funcs={funcs} />
    </div>
  )
}
