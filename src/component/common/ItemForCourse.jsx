import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

const { Title, Text } = Typography

const ItemForCourseStyled = styled.div`
  width: 100%;
  padding: 8px;
`

export default function ItemForCourse(props) {
  const { index, title, description } = props
  return (
    <ItemForCourseStyled>
      <Title level={5}>{`${index}. ${title}`}</Title>
      <Text>{description}</Text>
    </ItemForCourseStyled>
  )
}
