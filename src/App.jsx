import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/chat" /> : <Home />} />
        <Route path="/login" element={token ? <Navigate to="/chat" /> : <Login setToken={setToken} />} />
        <Route path="/register" element={token ? <Navigate to="/chat" /> : <Register />} />
        <Route path="/chat" element={token ? <Chat setToken={setToken} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
