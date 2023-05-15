import ChatPage from "./scenes/chatPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { useSelector } from "react-redux";
import { Routes, Route, BrowserRouter, HashRouter } from "react-router-dom";
import LoginPage from "./scenes/loginPage";
import { RootState } from "./store";

function App() {
  const isLogged = useSelector((state: RootState) => state.user.isLogged);

  return (
    <div className="app">
      <HashRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isLogged ? <ChatPage /> : <LoginPage />} />
          </Routes>
        </ThemeProvider>
      </HashRouter>
    </div>
  );
}

export default App;
