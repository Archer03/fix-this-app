import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

html,
body {
  height: 100%;
  margin: 0;
}

`
export default GlobalStyle;