import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import { ROLE } from '../../../../context/enum'
import SelfCoursesApprover from './SelfCoursesApprover'
import SelfCoursesProvider from './SelfCoursesProvider'
import SelfCoursesUser from './SelfCoursesUser'

export default function SelfCourses() {
  const { user } = useContext(UserContext)
  return (
    <>{
      (user && user.role === ROLE.ADMIN) ? <SelfCoursesApprover /> :
      (user && user.role === ROLE.SUPER_USER ? <SelfCoursesProvider /> : 
      (user && user.role === ROLE.USER ?<SelfCoursesUser />:<></>))
    }</>
  )
}
