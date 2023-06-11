import React, { useContext } from 'react'
import ItemForCourse from '../common/ItemForCourse'
import styled from 'styled-components'
import { AppContext } from '../../App'

const TestsStyled = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;

  .item-course {
    cursor: pointer;
    border-radius: 4px;
  }

  .item-course:hover {
    background: #f2f2f2;
  }
  .item-course.active {
    background-color: #ece9df;
  }
`

export default function Tests(props) {
  const { courseId, selected, select } = props
  const { user } = useContext(AppContext)
  const tests = [
    {testId: "t1", title: "Test 1", rate: 2.5, description: "Bài kiểm tra 1"},
    {testId: "t2", title: "Test 2", rate: 1, description: "Bài kiểm tra 2"},
    {testId: "t3", title: "Test 3", rate: 4.5, description: "Bài kiểm tra 3"},
    {testId: "t4", title: "Test 4", rate: 3, description: "Bài kiểm tra 4"},
    {testId: "t5", title: "Test 5", rate: 2, description: "Bài kiểm tra 5"},
    {testId: "t6", title: "Test 6", rate: 2, description: "Bài kiểm tra 6"},
    {testId: "t7", title: "Test 7", rate: 3.5, description: "Bài kiểm tra 7"},
    {testId: "t8", title: "Test 8", rate: 4, description: "Bài kiểm tra 8"},
    {testId: "t9", title: "Test 9", rate: 5, description: "Bài kiểm tra 9"},
  ]
  const newTest = {testId: "tNew", title: "Bài kiểm tra mới", rate: 0, description: "Thêm chi tiết bài kiểm tra mới"}

  return (
    <TestsStyled>
      {(user && user.role === 0 ? tests : [newTest, ...tests]).map((test, index) => (
        <div 
          key={test.testId}
          className={`item-course ${selected === test.testId ? "active":""}`}
          onClick={() => select(test.testId)}
        >
          <ItemForCourse title={test.title} rate={test.rate} description={test.description} index={index+(user && user.role === 1? 0:1)} />
        </div>
      ))}
    </TestsStyled>
  )
}
