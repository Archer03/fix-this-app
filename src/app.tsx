import NotesView from "./views/notes";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle, { ThemeColor } from "./globalStyle";
import Header from "./header";
import { Navigate, Route, Routes } from "react-router-dom";
import PriceTable from "./views/price-table";


export default () => {
  const [theme, setTheme] = useState<{ color: ThemeColor }>({ color: 'light' });
  const toggleTheme = () => setTheme({ color: theme.color === 'light' ? 'dark' : 'light' });

  return <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Header toggleTheme={toggleTheme} />
    <Routes>
      <Route path="/" element={<Navigate to="notes" />} />
      <Route path="notes" element={<NotesView />} />
      <Route path="price" element={<PriceTable />} />
    </Routes>
  </ThemeProvider>
}