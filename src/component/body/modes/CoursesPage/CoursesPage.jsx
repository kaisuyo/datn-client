import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import { ROLE } from '../../../../context/enum'
import CoursesAdmin from './CoursesAdmin'
import CoursesAll from './CoursesAll'

export default function CoursesPage() {
  const { user } = useContext(UserContext)
  return (
    <>
      {user && user.role === ROLE.ADMIN ? <CoursesAdmin />:<CoursesAll />}
    </>
  )
}
