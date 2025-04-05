// 📁 frontend/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3">
      <Link className="navbar-brand fw-bold" to="/">🎬 MiniBlog</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/discover">Descubrir</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/create">Crear Reseña</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">Mi Perfil</Link>
          </li>
        </ul>
        {token && (
          <button onClick={logout} className="btn btn-sm btn-outline-light">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
