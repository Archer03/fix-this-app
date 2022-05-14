import { createRoot } from "react-dom/client";
import App from "./app";
import GlobalStyle from "./globalStyle";


const rootElement = document.getElementById("app");
const root = createRoot(rootElement!);

root.render(<>
  <GlobalStyle />
  <App />
</>);