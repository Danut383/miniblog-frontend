// 📁 frontend/src/pages/ReviewDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../services/api";

function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(3);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    const fetchReview = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar la reseña");
        const data = await res.json();
        setReview(data);
      } catch (err) {
        console.error("Error cargando reseña:", err);
      }
    };

    const fetchAvgRating = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews/${id}/avg`);
        if (!res.ok) throw new Error("No se pudo cargar el promedio");
        const data = await res.json();
        setAvgRating(data.average);
      } catch (err) {
        console.error("Error promedio:", err);
      }
    };

    fetchReview();
    fetchAvgRating();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Debes iniciar sesión");

    try {
      const res = await fetch(`${API_URL}/reviews/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newComment,
          rating: newRating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al comentar");
      } else {
        setReview((prev) => ({
          ...prev,
          comments: [
            ...prev.comments,
            {
              text: newComment,
              rating: newRating,
              createdAt: new Date().toISOString(),
              username: "Tú",
            },
          ],
        }));
        setNewComment("");
        setNewRating(3);
        setError("");
      }
    } catch (err) {
      console.error("Error al comentar", err);
      setError("Error del servidor");
    }
  };

  if (!review) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <h2>📽️ {review.movieTitle}</h2>
      <div className="row mt-3">
        <div className="col-md-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
            alt={review.movieTitle}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <p><strong>Publicado por:</strong> {review.username || review.user?.username || "Desconocido"}</p>
          <p><strong>Tu comentario:</strong> {review.comment}</p>
          <p><strong>Tu rating:</strong> ⭐ {review.rating}/5</p>
          <p><strong>Rating promedio de la comunidad:</strong> {avgRating}</p>
        </div>
      </div>

      <hr />
      <h4 className="mt-4">💬 Comentarios</h4>

      {review.comments?.length === 0 ? (
        <p className="text-muted">Aún no hay comentarios</p>
      ) : (
        <ul className="list-group">
          {review.comments.map((c, i) => (
            <li key={i} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{c.username || "Anon"}</strong>: {c.text}
                </div>
                <div>⭐ {c.rating}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h5 className="mt-4">Agregar comentario</h5>
      <form onSubmit={handleSubmitComment}>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu opinión"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label me-2">Rating</label>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setNewRating(n)}
              style={{
                cursor: "pointer",
                fontSize: "1.4rem",
                color: n <= newRating ? "#ffc107" : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">Comentar</button>
      </form>
    </div>
  );
}

export default ReviewDetail;
