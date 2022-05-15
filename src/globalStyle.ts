import { createGlobalStyle, css, keyframes } from 'styled-components'

export type ThemeColor = 'light' | 'dark';

declare module 'styled-components' {
  // extends definitions  https://styled-components.com/docs/api#create-a-declarations-file
  export interface DefaultTheme {
    color: ThemeColor;
  }
}

const GlobalStyle = createGlobalStyle`
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  ${({ theme: { color } }) => {
    const themeColor = {
      light: `
        color: #2c3e50;
      `,
      dark: `
        background: #2f3542;
        color: #ffffff;
      `
    };
    return themeColor[color];
  }}
}

html,
body {
  height: 100%;
  margin: 0;
}

`
export default GlobalStyle;

// for reshake has bug, so use simple version until reshake fixed it.
const ShakeLittleFrames = keyframes`
  0% {
    transform: translate(0,0) rotate(0)
  }
  10% {
    transform: translate(-0.3891301853093654px, -0.7533240222661881px) rotate(-0.8679975855386153deg)
  }
  20% {
    transform: translate(0.04114211555227909px, -0.7934809775973055px) rotate(-0.7974182304262944deg)
  }
  30% {
    transform: translate(-0.6082396044941776px, -0.44358696327401015px) rotate(0.08591341961689869deg)
  }
  40% {
    transform: translate(-0.3940602538324516px, 0.0527427808283365px) rotate(0.04050595907029608deg)
  }
  50% {
    transform: translate(0.2850169312019446px, -0.1282064181182565px) rotate(-0.13171204478596454deg)
  }
  60% {
    transform: translate(0.43094485216651846px, 0.17976529808897457px) rotate(-0.784217778864563deg)
  }
  70% {
    transform: translate(-0.03834415269552549px, -0.7223028512565115px) rotate(-0.004969798257329572deg)
  }
  80% {
    transform: translate(0.6818977702603441px, -0.34375977896453147px) rotate(-0.15684129357718124deg)
  }
  90% {
    transform: translate(-0.17404596351862844px, 0.37072436246545326px) rotate(0.7707097869634505deg)
  }
  100% {
    transform: translate(0,0) rotate(0)
  }
`

export const ShakeCss = css`
  display: inherit;
  transform-origin: center center;
  &:hover {
    /* animation-play-state: running; */
    animation-name: ${ShakeLittleFrames};
    animation-duration: 300ms;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite; 
  }
`