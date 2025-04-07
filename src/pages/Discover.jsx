// 📁 frontend/src/pages/Discover.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { fetchPopularMovies, searchMovies } from "../services/tmdb";
import { Input } from "@/components/ui/input";

function Discover() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = query
        ? await searchMovies(query)
        : await fetchPopularMovies(page);
      setMovies(data.results);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (err) {
      console.error("❌ Error al cargar pelis:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadMovies();
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>🎬 Películas Populares</h2>
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <Input
            type="text"
            placeholder="Buscar películas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-100"
          />
          <button className="btn btn-primary">Buscar</button>
        </form>
      </div>

      {loading ? (
        <p className="text-center">Cargando películas...</p>
      ) : movies.length === 0 ? (
        <p className="text-muted text-center">No se encontraron películas</p>
      ) : (
        <div className="row">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="col-6 col-sm-4 col-md-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
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
      )}

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
