import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../services/api";

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/reviews`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Respuesta no válida del servidor");
        }
        return res.json();
      })
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error cargando reseñas:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📝 Reseñas Recientes</h2>
      <div className="row">
        {reviews.length === 0 ? (
          <p className="text-muted">No hay reseñas todavía.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="col-md-4 mb-4">
              <Link to={`/review/${review.id}`} className="text-decoration-none text-dark">
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
                    <p className="card-text text-truncate">{review.comment}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <span>⭐ {review.rating}/5</span>
                    <span className="btn btn-sm btn-outline-primary">Ver más</span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
