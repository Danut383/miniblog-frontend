import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API_URL from "../services/api";
import { Card, CardContent } from "@/components/ui/card";

function Profile() {
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [updatedRating, setUpdatedRating] = useState(5);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener reseñas");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error cargando reseñas del perfil:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta reseña?")) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al eliminar reseña");
      fetchUserReviews(); // Recargar
    } catch (err) {
      alert("No se pudo eliminar la reseña");
    }
  };

  const handleEdit = (review) => {
    setEditMode(review.id);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: updatedComment,
          rating: updatedRating,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar reseña");
      setEditMode(null);
      fetchUserReviews();
    } catch (err) {
      alert("No se pudo actualizar la reseña");
    }
  };

  return (
    <div className="container mt-4">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-2xl font-bold">
        👤 Mis Reseñas
      </motion.h2>
      {reviews.length === 0 ? (
        <p className="text-muted">No has publicado ninguna reseña aún.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl overflow-hidden shadow-md h-full">
                {review.posterPath && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                    alt={review.movieTitle}
                    className="w-full h-64 object-cover"
                  />
                )}
                <CardContent className="p-4 flex flex-col gap-2">
                  <h5 className="text-lg font-semibold">{review.movieTitle}</h5>
                  {editMode === review.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                      />
                      <div className="mb-2 flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <span
                            key={num}
                            onClick={() => setUpdatedRating(num)}
                            style={{
                              fontSize: "1.5rem",
                              cursor: "pointer",
                              color: updatedRating >= num ? "#ffc107" : "#ddd",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdate(review.id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditMode(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{review.comment}</p>
                      <p>⭐ {review.rating}/5</p>
                      <div className="flex justify-between mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(review)}
                        >
                          📝 Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(review.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </CardContent>
                <div className="p-2 border-t text-end">
                  <a
                    href={`https://www.themoviedb.org/movie/${review.movieId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-dark"
                  >
                    Ver en TMDB
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
