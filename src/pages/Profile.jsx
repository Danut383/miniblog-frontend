// 📁 frontend/src/pages/Profile.jsx
import { useEffect, useState } from "react";

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
      const res = await fetch("http://localhost:5000/api/reviews/user", {
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
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
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
    setEditMode(review._id);
    setUpdatedComment(review.comment);
    setUpdatedRating(review.rating);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
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
      <h2>👤 Mis Reseñas</h2>
      {reviews.length === 0 ? (
        <p className="text-muted">No has publicado ninguna reseña aún.</p>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div key={review._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {review.posterPath && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                    className="card-img-top"
                    alt={review.movieTitle}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{review.movieTitle}</h5>

                  {editMode === review._id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                      />
                      <div className="mb-2 d-flex gap-2">
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
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleUpdate(review._id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditMode(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="card-text">{review.comment}</p>
                      <p>⭐ {review.rating}/5</p>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(review)}
                      >
                        📝 Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(review._id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </div>
                <div className="card-footer text-end">
                  <a
                    href={`https://www.themoviedb.org/movie/${review.movieId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-dark"
                  >
                    Ver en TMDB
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
