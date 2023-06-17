import API from '../../context/config'
import styled from 'styled-components'

const BodyStyled = styled.div`
  margin-top: 68px;
  width: 100vw;
`

export default function Body(props) {
  const { curFunc, funcs } = props
  const func = funcs.find(func => func.key === curFunc)

  return (
    <BodyStyled>
      {func && func.tab}
    </BodyStyled>
  )
}
