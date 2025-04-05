// 📁 frontend/src/pages/home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import API_URL from "../services/api";

function Home() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 6;

  useEffect(() => {
    fetch(`${API_URL}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error cargando reseñas:", err));
  }, []);

  const offset = currentPage * reviewsPerPage;
  const currentReviews = reviews.slice(offset, offset + reviewsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📝 Reseñas Recientes</h2>
      <div className="row">
        {currentReviews.length === 0 ? (
          <p className="text-muted">No hay reseñas todavía.</p>
        ) : (
          currentReviews.map((review) => (
            <motion.div
              key={review.id}
              className="col-md-4 mb-4"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/review/${review.id}`}
                className="text-decoration-none text-dark"
              >
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
            </motion.div>
          ))
        )}
      </div>

      <ReactPaginate
        pageCount={Math.ceil(reviews.length / reviewsPerPage)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName="pagination justify-content-center mt-4"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="active"
        previousLabel="<"
        nextLabel=">"
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
      />
    </div>
  );
}

export default Home;
