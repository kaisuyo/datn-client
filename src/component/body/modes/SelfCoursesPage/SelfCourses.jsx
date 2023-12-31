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
      (user && user.role === ROLE.APPROVER) ? <SelfCoursesApprover /> :
      (user && user.role === ROLE.PROVIDER ? <SelfCoursesProvider /> : 
      (user && user.role === ROLE.LEARNER ?<SelfCoursesUser />:<></>))
    }</>
  )
}
