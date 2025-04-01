// 📁 frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import Register from "./pages/register";
import ReviewDetail from "./pages/ReviewDetail";
import Discover from "./pages/Discover"; // si tienes página para descubrir pelis
import Navbar from "./components/Navbar";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // ✅ Verifica el token cada vez que cambia la ruta
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  // ✅ Oculta el Navbar en login y register
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        {!isAuthenticated ? (
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/review/:id" element={<ReviewDetail />} />
            
            <Route path="/discover" element={<Discover />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
