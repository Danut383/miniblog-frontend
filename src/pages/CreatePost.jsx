// 📁 frontend/src/pages/CreatePost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieSearchInput from "../components/MovieSearchInput";
import API_URL from "../services/api";

function CreatePost() {
  const [movie, setMovie] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movie) return alert("Selecciona una película");
    const token = localStorage.getItem("token");
    if (!token) return alert("Necesitas estar autenticado");

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: String(movie.id),
          movieTitle: movie.title,
          posterPath: movie.poster_path,
          comment,
          rating,
        }),
      });

      if (res.ok) {
        navigate("/");
      } else {
        const data = await res.json();
        alert("Error al crear reseña: " + (data?.error || "Desconocido"));
      }
    } catch (err) {
      alert("Error al enviar reseña");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Reseña</h2>
      <form onSubmit={handleSubmit}>
        <MovieSearchInput onMovieSelect={setMovie} />
        {movie && (
          <div className="mb-3 mt-2">
            <div className="d-flex align-items-center gap-3">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                style={{ borderRadius: "10px", maxHeight: "150px" }}
              />
              <h5 className="mb-0">{movie.title}</h5>
            </div>
          </div>
        )}
        <div className="mb-3 mt-3">
          <label>Comentario</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Calificación</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                onClick={() => setRating(num)}
                style={{
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: rating >= num ? "#ffc107" : "#ddd",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Publicar Reseña
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
