// 📁 frontend/src/pages/Discover.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { searchMovies } from "../services/tmdb";

function Discover() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await searchMovies(query || "a", page);
        setMovies(result.results);
        setTotalPages(Math.min(result.total_pages, 500));
      } catch (err) {
        console.error("Error al cargar películas:", err);
      }
    };
    fetchData();
  }, [query, page]);

  const handlePageChange = ({ selected }) => setPage(selected + 1);

  return (
    <motion.div className="container mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="mb-4">🎬 Películas Populares</h2>

      <div className="mb-3 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="row">
        {movies.map((movie) => (
          <motion.div key={movie.id} className="col-md-3 mb-4" whileHover={{ scale: 1.05 }}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title text-truncate">{movie.title}</h5>
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
