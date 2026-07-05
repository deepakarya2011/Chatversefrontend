import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

const isLoggedIn = () => !!localStorage.getItem("token");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn() ? <Navigate to="/chat" /> : <Home />} />
        <Route path="/login" element={isLoggedIn() ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/register" element={isLoggedIn() ? <Navigate to="/chat" /> : <Register />} />
        <Route path="/chat" element={isLoggedIn() ? <Chat /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
