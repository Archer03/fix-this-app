import styled, { useTheme } from "styled-components"

type HeaderProps = {
  toggleTheme: () => void
}
const Header = (props: HeaderProps) => {
  const theme = useTheme()
  const buttonText = {
    dark: '日间模式',
    light: '暗黑模式'
  }[theme.color]
  return <HeaderWrapper>
    <ChangeThemeBtn onClick={() => props.toggleTheme()}>
      {buttonText}
    </ChangeThemeBtn>
  </HeaderWrapper>
}

export default Header;

const HeaderWrapper = styled.div`
  height: 60px
`

const ChangeThemeBtn = styled.button`
  z-index: 1;
  position: relative;
  font-size: inherit;
  font-family: inherit;
  color: white;
  padding: 0.5em 1em;
  outline: none;
  border: none;
  background-color: hsl(236, 32%, 26%);


  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fc2f70;
    transform-origin: center right;
    transform: scaleX(0);
    transition: transform 0.25s ease-in-out;
  }

  &:hover {
    cursor: pointer;
  }

  &:hover::before {
    transform-origin: center left;
    transform: scaleX(1);
  }
`