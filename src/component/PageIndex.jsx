import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/AppContext'
import { FUNC, ROLE } from '../context/enum'
import Body from './body/Body'
import LoginPage from './body/modes/LoginPage'
import RegisterPage from './body/modes/RegisterPage'
import Header from './header/Header'
import API from '../context/config'
import SubjectsPage from './body/modes/SubjectsPage'
import AdminsPage from './body/modes/AdminsPage'
import CourseSourcePage from './body/modes/CourseSourcePage'
import SelfCourses from './body/modes/SelfCoursesPage/SelfCourses'
import CoursesPage from './body/modes/CoursesPage/CoursesPage'
import Require from './body/modes/Require'
import SuggestPage from './body/modes/SuggestPage'

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
      tab: (<CoursesPage />)
    },
    {
      key: FUNC.SELF_COURSES,
      name: "Của bạn",
      isShow: () => (user && [ROLE.LEARNER, ROLE.PROVIDER, ROLE.APPROVER].includes(user.role)),
      tab: (<SelfCourses />)
    },
    {
      key: FUNC.NOTIC,
      name: "Yêu cầu",
      isShow: () => (user && user.role === ROLE.PROVIDER),
      tab: (<Require />)
    },
    {
      key: FUNC.SUBJECTS, 
      name: "Môn học",
      isShow: () => (user && user.role === ROLE.SYSTEM),
      tab: (<SubjectsPage />)
    },
    {
      key: FUNC.ADMINS, 
      name: "Người phụ trách", 
      isShow: () => (user && user.role === ROLE.SYSTEM),
      tab: (<AdminsPage />)
    },
    {
      key: FUNC.COURSE_SOURCE, 
      name: "Nhà cung cấp", 
      isShow: () => (user && [ROLE.SYSTEM].includes(user.role)),
      tab: (<CourseSourcePage />)
    },
    {
      key: FUNC.SUGGEST, 
      name: "Gợi ý khóa học",
      isShow: () => (user && [ROLE.SYSTEM].includes(user.role)),
      tab: (<SuggestPage />)
    }
  ]

  useEffect(() => {
    API.post('/auth/').then(res => {
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
