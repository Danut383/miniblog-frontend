// 📁 frontend/src/pages/login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../services/api";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error en el login", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center text-primary">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>

        {/* ✅ Enlace a registro */}
        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
