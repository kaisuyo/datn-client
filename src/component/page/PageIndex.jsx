import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import SideBar from './SideBar'
import Header from './Header'
import Courses from './Courses'
import Statistical from './Statistical'
import SelfCourse from './SelfCourse'
import CourseModal from './CourseModal'
import { AppContext } from '../../App'
import Auth from './Auth'
import SuperStatistical from './SuperStatistical'

const PageIndexStyled = styled.div`
	position: relative;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	overflow: hidden;
	background-color: #efefef;

	.sidebar {
		width: 180px;
		height: 100%;
		background: #3151f1;
	}

	.left-page {
		width: calc(100% - 180px);
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		.header {
			width: 100%;
			height: 56px;
		}

		.body {
			height: calc(100vh - 56px);
			width: 100%;
			display: flex;
				
			.courses {
				height: 100%;
				width: calc(100% - 300px);
			}

			.sub-info {
				width: 300px;
				height: 100%;

				.statistical {
					width: 100%;
					padding-bottom: 8px;
				}

				.self-courses {
					width: 100%;
					height: calc(100% - 224px);
				}
			}

			.super-statistical {
				width: 100%;
				height: 100%;
			}
		}
	}
`

export default function PageIndex() {
  const [itemFunc, setItemFunc] = useState('courses')
	const [courseId, setCourseId] = useState(null)
	const { user } = useContext(AppContext)
	const [showAuth, setShowAuth] = useState(0)

	useEffect(() => {
		if (!user) {
			setItemFunc("courses")
		}
	}, [user])

	const pageIndexRender = useMemo(() => (
		<>
			<div className="sidebar">
				<SideBar curFunc={itemFunc} changeItemFunc={setItemFunc} />
			</div>
			<div className="left-page">
				<div className="header">
					<Header curFunc={itemFunc} setShowAuth={setShowAuth} />
				</div>
				<div className="body">
					{itemFunc === "courses" && <>
						<div className="courses">
							<Courses setCourseId={setCourseId} setShowAuth={setShowAuth} />
						</div>
						{user && <div className="sub-info">
							<div className="statistical">
								<Statistical changeItemFunc={setItemFunc} />
							</div>
							<div className="self-courses">
								{user && user.role === 0 && <SelfCourse setCourseId={setCourseId} />}
							</div>
						</div>}
					</>}
					{itemFunc === "statistical" && <>
						<div className="super-statistical">
							<SuperStatistical />
						</div>
					</>}
				</div>
			</div>
		</>
	), [user, itemFunc])

  return (
    <PageIndexStyled>
			<CourseModal courseId={courseId} setCourseId={setCourseId} />
			<Auth showAuth={showAuth} setShowAuth={setShowAuth} />
			{pageIndexRender}
    </PageIndexStyled>
  )
}
