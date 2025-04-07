// 📁 frontend/src/components/MovieSearchInput.jsx
import { useState } from "react";
import { searchMovies } from "../services/tmdb";

function MovieSearchInput({ onMovieSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query.trim() === "") return;
    const data = await searchMovies(query);
    setResults(data.results || []);
  };

  return (
    <div className="mb-3 position-relative">
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {results.length > 0 && (
        <ul
          className="list-group position-absolute z-3 w-100 mt-2"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {results.map((movie) => (
            <li
              key={movie.id}
              className="list-group-item list-group-item-action d-flex align-items-center"
              onClick={() => {
                onMovieSelect(movie);
                setQuery(movie.title);
                setResults([]);
              }}
              style={{ cursor: "pointer" }}
            >
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="me-2"
                  style={{ borderRadius: "4px" }}
                />
              )}
              <span>{movie.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieSearchInput;
