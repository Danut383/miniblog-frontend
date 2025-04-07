import { useState } from "react";
import { motion } from "framer-motion";
import { searchMovies } from "../services/tmdb";

function MovieSearchInput({ onMovieSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query.trim()) {
      const data = await searchMovies(query);
      setResults(data);
    }
  };

  return (
    <div className="mb-3">
      <div className="d-flex mb-2">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {results.length > 0 && (
        <div className="row">
          {results.map((movie) => (
            <motion.div
              key={movie.id}
              className="col-md-2 mb-3"
              whileHover={{ scale: 1.03 }}
            >
              <div
                className="card h-100 shadow-sm border border-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onMovieSelect(movie);
                  setResults([]); // Oculta resultados después de seleccionar
                  setQuery("");
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="card-img-top"
                />
                <div className="card-body p-2">
                  <h6 className="card-title text-truncate mb-0">
                    {movie.title}
                  </h6>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearchInput;
