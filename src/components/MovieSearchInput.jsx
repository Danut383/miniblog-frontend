import { useState } from "react";
import { fetchMovieByQuery } from "../services/tmdb";
import { motion } from "framer-motion";

function MovieSearchInput({ onMovieSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const data = await fetchMovieByQuery(query);
      setResults(data.results || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Error al buscar película:", err);
    }
  };

  const handleSelect = (movie) => {
    onMovieSelect(movie);
    setQuery(movie.title);
    setShowDropdown(false);
  };

  return (
    <div className="mb-3 position-relative">
      <form onSubmit={handleSearch} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Buscar
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <motion.ul
          className="list-group position-absolute w-100 shadow-sm z-3 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {results.map((movie) => (
            <li
              key={movie.id}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(movie)}
            >
              🎬 {movie.title}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

export default MovieSearchInput;
