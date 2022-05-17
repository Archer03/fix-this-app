import { Link, useLocation } from "react-router-dom"
import styled, { useTheme } from "styled-components"

type HeaderProps = {
  toggleTheme: () => void
}
const Header = (props: HeaderProps) => {
  const theme = useTheme();
  const location = useLocation();
  const buttonText = {
    dark: '日间模式',
    light: '暗黑模式'
  }[theme.color];
  return <HeaderWrapper>
    <NavArea>
      <NavLinkBtn isActive={location.pathname === '/notes'}>
        <Link to="notes">笔记</Link>
      </NavLinkBtn>
      <NavLinkBtn isActive={location.pathname === '/price'}>
        <Link to="price">价格表</Link>
      </NavLinkBtn>
    </NavArea>

    <RightArea>
      <ChangeThemeBtn onClick={() => props.toggleTheme()}>
        {buttonText}
      </ChangeThemeBtn>
    </RightArea>
  </HeaderWrapper>
}

export default Header;

const HeaderWrapper = styled.div`
  height: 60px;
  display: flex;
`

const NavArea = styled.div`
  flex-grow: 1;
  display: flex;
  padding-top: 10px;
`
const RightArea = styled.div`
  width: 20vw;
`

const NavLinkBtn = styled.div<{ isActive?: boolean }>`
  position: relative;
  font-size: large;
  display: inline-block;
  width: 100px;
  height: 50px;
  font-style: italic;

  & a {
    text-decoration: none;
    color: ${props => ({
      light: '-webkit-link',
      dark: '#eeeeee'
    })[props.theme.color]};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3cefff;
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform-origin: bottom left;
    transform: scaleX(1);
  }

  ${props => props.isActive && `
    &::before {
      transform-origin: bottom left;
      transform: scaleX(1);
    }
  `}
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