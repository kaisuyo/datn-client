import styled from 'styled-components'

const BodyStyled = styled.div`
  width: 100vw;
  padding-top: 36px;
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
