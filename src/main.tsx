import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";


const rootElement = document.getElementById("app");
const root = createRoot(rootElement!);

root.render(<BrowserRouter>
  <App />
</BrowserRouter>);