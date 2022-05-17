import NotesView from "./views/notes";
import { useLayoutEffect, useState } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import GlobalStyle from "./globalStyle";
import Header from "./header";
import { Navigate, Route, Routes } from "react-router-dom";
import PriceTable from "./views/price-table";


export default () => {
  const [theme, setTheme] = useState<DefaultTheme>({ color: 'light' });
  const toggleTheme = () => {
    const toTheme: DefaultTheme = { color: theme.color === 'light' ? 'dark' : 'light' };
    setTheme(toTheme);
    localStorage.setItem("notesapp-theme", JSON.stringify(toTheme));
  };

  useLayoutEffect(() => {
    const userTheme = JSON.parse(localStorage.getItem('notesapp-theme') || '{ "color": "light" }');
    setTheme(userTheme)
  }, [])

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