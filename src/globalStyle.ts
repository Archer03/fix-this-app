import { createGlobalStyle } from 'styled-components'

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