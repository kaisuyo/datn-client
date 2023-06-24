import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../../../context/AppContext'
import { ROLE } from '../../../../context/enum'
import CoursesPageForAdmin from './CoursesForAdmin'
import CoursesPageForAll from './CoursesPageForAll'

export default function CoursesPage() {
  const { user } = useContext(UserContext)
  return (
    <>
      {user && user.role === ROLE.ADMIN ? <CoursesPageForAdmin />:<CoursesPageForAll />}
    </>
  )
}
