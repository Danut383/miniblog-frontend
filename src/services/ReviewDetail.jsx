import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../services/api";
import { motion } from "framer-motion";

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
            {
              text: newComment,
              rating: newRating,
              createdAt: new Date().toISOString(),
              user: { username: "Tú" },
            },
            ...prev.comments,
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
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="mb-4">🎥 {review.movieTitle}</h2>
      <div className="row">
        <div className="col-md-4">
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
            alt={review.movieTitle}
            className="img-fluid rounded shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          />
        </div>
        <div className="col-md-8">
          <p><strong>Autor:</strong> {review.user?.username || "Desconocido"}</p>
          <p><strong>Comentario:</strong> {review.comment}</p>
          <p><strong>Calificación:</strong> ⭐ {review.rating}/5</p>
          <p><strong>Promedio comunidad:</strong> {avgRating}</p>
        </div>
      </div>

      <hr />
      <h4 className="mt-4">💬 Comentarios</h4>

      {review.comments?.length === 0 ? (
        <p className="text-muted">Aún no hay comentarios</p>
      ) : (
        <motion.ul
          className="list-group"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {review.comments.map((c, i) => (
            <motion.li
              key={i}
              className="list-group-item d-flex justify-content-between"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span>
                <strong>{c.user?.username || "Anónimo"}:</strong> {c.text}
              </span>
              <span>⭐ {c.rating}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}

      <hr />
      <h5 className="mt-4">📝 Agrega un comentario</h5>
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
        <div className="mb-3 d-flex align-items-center gap-2">
          <label className="form-label me-2">Calificación:</label>
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
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </motion.div>
  );
}

export default ReviewDetail;
