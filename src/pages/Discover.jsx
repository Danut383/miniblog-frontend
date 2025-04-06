// 📁 frontend/src/pages/Discover.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { fetchPopularMovies } from "../services/tmdb";

function Discover() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPopularMovies(page);
        setMovies(data?.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500)); // límite de TMDB
      } catch (err) {
        console.error("Error al cargar pelis:", err);
        setMovies([]);
      }
    };
    fetchData();
  }, [page]);

  const handlePageChange = ({ selected }) => setPage(selected + 1);

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="mb-4 text-center">🎬 Películas Populares</h2>

      <div className="row">
        {Array.isArray(movies) && movies.map((movie) => (
          <motion.div
            key={movie.id}
            className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="card h-100 shadow-sm border-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top rounded"
                alt={movie.title}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body p-2">
                <h6 className="card-title text-truncate text-center mb-0">
                  {movie.title}
                </h6>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          breakLabel={"..."}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </motion.div>
  );
}

export default Discover;
